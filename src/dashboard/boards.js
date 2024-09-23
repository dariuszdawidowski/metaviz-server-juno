import { v4 as uuidv4 } from 'uuid';
import { listDocs, setDoc, getDoc, deleteDoc, deleteManyDocs, listAssets } from '@junobuild/core';
import { renderAdd } from './add.js';
import { renderPanelExpenses, updatePanelExpenses } from './expenses.js';
import { renderSidebar } from './sidebar.js';
import { renderTopbar } from './topbar.js';
import { addEvent, padToTwoDigits } from '../utils.js';

const showSpinner = () => {
    document.getElementById('metaviz-spinner').style.display = 'block';
};

const hideSpinner = () => {
    document.getElementById('metaviz-spinner').style.display = 'none';
};

const addCategory = async (name, index) => {
    showSpinner();
    await setDoc({
        collection: 'categories',
        doc: {
            key: uuidv4(),
            data: {
                name,
                index
            }
        }
    });
    updateDashboard();
    hideSpinner();
};

const addBoard = async (name, categoryId) => {
    showSpinner();
    await setDoc({
        collection: 'boards',
        doc: {
            key: uuidv4(),
            data: {
                name,
                category: categoryId,
                json: null
            }
        }
    });
    updateDashboard();
    hideSpinner();
};

const renderRecent = (boards) => {

    return `
        <div class="group">
            <h1>⇢ Recent</h1>
            <div class="section">
                ${boards.map((item, index) => {
                    return renderBoardIcon({ id: item.key, name: item.data.name, updated: Number(item.updated_at / 1000000n) });
                }).join('')}
            </div>
        </div>
    `;

};

const renderBoardIcon = (board) => {

    const date = new Date(board.updated);
    const dd = date.getDate();
    const mm = date.getMonth() + 1;

    return `
        <a href="?board=${board.id}" target="_blank" class="board-link-a" data-board="${board.id}">
            <div class="board-link">
                <div class="board-link-date">${padToTwoDigits(dd)}.${padToTwoDigits(mm)}</div>
                <div class="board-link-name">${board.name}</div>
            </div>
        </a>
    `;

};

const renderCategory = (app, category, boards) => {

    return `
        <div class="group">
            <h1>⇢ ${category.name}</h1>
            <div class="dots" data-category="${category.id}">...</div>
            <div class="section">
                ${boards.map((item, index) => {
                    if (item.data.category == category.id) {
                        return renderBoardIcon({ id: item.key, name: item.data.name, updated: Number(item.updated_at / 1000000n) });
                    }
                }).join('')}
            </div>
            ${renderAdd(app, {text: 'ADD NEW BOARD', placeholder: 'Board name', callback: async (value) => {
                await addBoard(value, category.id);
            }})}
        </div>
    `;

};

const renderAll = (boards) => {

    return `
        <div class="group">
            <h1>⇢ All boards</h1>
            <div class="section">
                ${boards.map((item, index) => {
                    return renderBoardIcon({ id: item.key, name: item.data.name, updated: Number(item.updated_at / 1000000n) });
                }).join('')}
            </div>
        </div>
    `;

};

const moveCategory = (categoryId, direction) => {
    showSpinner();
    listDocs({
        collection: 'categories'
    }).then(listCategories => {
        for (const category of listCategories.items) {
            if (category.key == categoryId) {
                const oldIndex = category.data.index;
                const desiredIndex = category.data.index + direction;
                if (desiredIndex > -1 && desiredIndex < listCategories.items.length) {
                    category.data.index = desiredIndex;
                    setDoc({
                        collection: 'categories',
                        doc: category
                    }).then(() => {
                        for (const category of listCategories.items) {
                            if (category.key != categoryId && category.data.index == desiredIndex) {
                                category.data.index = oldIndex;
                                setDoc({
                                    collection: 'categories',
                                    doc: category
                                }).then(() => {
                                    hideSpinner();
                                    updateDashboard();
                                });
                            }
                        }
                    });
                }
                else {
                    hideSpinner();
                }
            }
        }
    });
};

export const renderDashboard = (app) => {

    // Selected category id by menu
    let selectedCategory = null;

    // Selected board id by menu
    let selectedBoard = null;

    // Context menu for category
    const menuCategory = new TotalLiteMenu({container: document.body});

    // Move up
    menuCategory.addItem({
        parent: 'root',
        id: 'cat-move-up',
        name: '⬆️ Move up',
        onClick: () => {
            moveCategory(selectedCategory, -1);
        }
    });

    // Move down
    menuCategory.addItem({
        parent: 'root',
        id: 'cat-move-down',
        name: '⬇️ Move down',
        onClick: () => {
            moveCategory(selectedCategory, 1);
        }
    });

    // Delete
    menuCategory.addItem({
        parent: 'root',
        id: 'cat-del',
        name: '❌ Delete category',
        onClick: () => {
            if (confirm('Are you sure to delete this category and ALL of its boards?')) {
                showSpinner();
                listDocs({
                    collection: 'boards'
                }).then(listBoards => {
                    // Delete assigned boards
                    const boardsToDelete = listBoards.items.filter(b => b.data.category == selectedCategory);
                    deleteManyDocs({
                        docs: boardsToDelete.map(d => { return { collection: 'boards', doc: d } })
                    }).then(() => {
                        // Delete category
                        getDoc({
                            collection: 'categories',
                            key: selectedCategory
                        }).then(myDoc => {
                            deleteDoc({
                                collection: 'categories',
                                doc: myDoc
                            }).then(() => {
                                hideSpinner();
                                updateDashboard();
                            });
                        });
                    });
                });
            }
        }
    });

    // Context menu for board
    const menuBoard = new TotalLiteMenu({container: document.body});
    menuBoard.addItem({
        parent: 'root',
        id: 'open-board',
        name: '📝 Open board',
        onClick: () => {
            window.open(`?board=${selectedBoard}`, '_blank');
        }
    });
    menuBoard.addItem({
        parent: 'root',
        id: 'del-board',
        name: '❌ Delete board',
        onClick: () => {
            if (confirm('Are you sure to delete this board?')) {
                showSpinner();
                getDoc({
                    collection: 'boards',
                    key: selectedBoard
                }).then(myDoc => {
                    deleteDoc({
                        collection: 'boards',
                        doc: myDoc
                    }).then(() => {
                        hideSpinner();
                        updateDashboard();
                    });
                });
            }
        }
    });

    const observer = new MutationObserver(async () => {
        observer.disconnect();
        await updateDashboard();
    });
    observer.observe(app, {childList: true, subtree: true});

    app.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: row;">
            ${renderSidebar(app)}
            ${renderPanelExpenses(app)}
            <div id="boards" class="boards"></div>
        </div>
    `;

    // Left click on a category dots
    /*addEvent({
        target: app,
        selector: '.dots',
        type: 'click',
        fn: (event) => {
            selectedCategory = event.target.dataset.category;
            selectedBoard = null;
            menuCategory.show(event.clientX, event.clientY);
        }
    });*/

    // Right click on a category dots
    addEvent({
        target: app,
        selector: '.dots',
        type: 'contextmenu',
        fn: (event) => {
            selectedCategory = event.target.dataset.category;
            selectedBoard = null;
            menuCategory.show(event.clientX, event.clientY);
        }
    });

    // Right click on a board arrow
    addEvent({
        target: app,
        selector: '.board-link-a',
        type: 'contextmenu',
        fn: (event) => {
            selectedCategory = null;
            selectedBoard = event.target.dataset.board;
            menuBoard.show(event.clientX, event.clientY);
}
    });

};

const updateDashboard = async () => {

    // Query data
    const categories = await listDocs({
        collection: 'categories'
    });
    const boards = await listDocs({
        collection: 'boards'
    });
    const files = await listAssets({
        collection: 'files',
    });

    // Recent files
    const recentBoards = boards.items.toSorted((a, b) => {
        if (a.updated_at > b.updated_at) return -1;
        if (a.updated_at < b.updated_at) return 1;
        return 0;
    }).slice(0, 5);

    // Render boards column
    if (categories.items.length > 0) {
        document.querySelector('#boards').innerHTML = `
            ${renderTopbar({ categories: categories.items.length, boards: boards.items.length})}
            ${renderRecent(recentBoards)}
            ${categories.items.toSorted((a, b) => a.data.index - b.data.index).map(item => {
                return renderCategory(app, { id: item.key, name: item.data.name }, boards.items);
            }).join('')}
            <div class="group">
                ${renderAdd(app, {text: 'ADD NEW CATEGORY', placeholder: 'Category name', callback: async (value) => {
                    await addCategory(value, categories.items.length);
                }})}
            </div>
            ${renderAll(boards.items)}
        `;
    }

    // No categories yet
    else {
        document.querySelector('#boards').innerHTML = `
            <div class="group">
                <div style="margin: 23px; color: #000; font-size: 14px;">🔔 &nbsp;It looks like everything is still empty. Add your first category, for example "My boards".</div>
                ${renderAdd(app, {text: 'ADD NEW CATEGORY', placeholder: 'Category name', callback: async (value) => {
                    await addCategory(value, categories.items.length);
                }})}
            </div>
        `;
    }

    // Info Panel Consumption and Expenses
    updatePanelExpenses({categories, boards, files});

};

window.addEventListener('reload', updateDashboard);
