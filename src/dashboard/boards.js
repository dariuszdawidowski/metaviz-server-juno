import { v4 as uuidv4 } from 'uuid';
import { listDocs, setDoc, getDoc, deleteDoc, deleteManyDocs } from '@junobuild/core';
import { jsonReplacer, jsonReviver } from '@junobuild/utils';
import { renderAdd } from './add.js';
import { renderSidebar } from './sidebar.js';
import { renderTopbar } from './topbar.js';
import { padToTwoDigits, bytes2Human, formatCycles, calculateCosts } from '../utils.js';

const showSpinner = () => {
    document.getElementById('metaviz-spinner').style.display = 'block';
};

const hideSpinner = () => {
    document.getElementById('metaviz-spinner').style.display = 'none';
};

const renderPanels = (args) => {

    return `
        <div class="infobar">
            <div class="tablet square">
                <h1>Consumption and Expenses</h1>
                <h2><span id="storage-expenses-usd"></span> / month</h2>
                <div>Storage</div>
                <div id="storage-expenses"></div>
            </div>
            <div class="tablet">
                <div style="text-align: center;">Metaviz v0.9.18 @ IC backend v0.6.0</div>
            </div>
        </div>
    `;

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
    update();
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
    update();
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
                                    update();
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

const update = async () => {

    const categories = await listDocs({
        collection: 'categories'
    });

    const catSize = categories.items.reduce((acc, item) => {
        const blob = new Blob([JSON.stringify(item.data, jsonReplacer)], { type: 'application/json; charset=utf-8' });
        return acc + blob.size;
    }, 0);

    const boards = await listDocs({
        collection: 'boards'
    });

    const recentBoards = boards.items.toSorted((a, b) => {
        if (a.updated_at > b.updated_at) return -1;
        if (a.updated_at < b.updated_at) return 1;
        return 0;
    }).slice(0, 5);

    const boardsSize = boards.items.reduce((acc, item) => {
        const blob = new Blob([JSON.stringify(item.data, jsonReplacer)], { type: 'application/json; charset=utf-8' });
        return acc + blob.size;
    }, 0);

    const codeSize = 39258685;

    // Data storage cost
    const price = calculateCosts({storage: (catSize + boardsSize), currency: 'C', nodes: 13})
    document.querySelector('#storage-expenses').innerHTML = `total of ${bytes2Human(codeSize + catSize + boardsSize)} | monthly ${formatCycles(price.storage.CYCLES)}<br>@ 13-nodes`;
    document.querySelector('#storage-expenses-usd').innerHTML = `$${Math.max(price.storage.USD, 0.01).toFixed(2)}`;
    // Data storage usage
    /*
    const ctx = document.getElementById('canister-storage-usage').getContext('2d');
    const tokenomicsChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Code', 'Data (stable)', 'Files (stable)', 'Heap'],
            datasets: [{
                data: [150000, 400000, 100000, 200000],
                backgroundColor: ['#f3c300', '#fe8c00', '#b93e8c', '#60388b'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.raw;
                            return label + ' MB';
                        }
                    }
                }
            }
        }
    });
    */

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

};

export const renderDashboard = (app) => {

    // Selected category id by menu
    let selectedCategory = null;

    // Selected board id by menu
    let selectedBoard = null;

    // Context menu for category
    const menuCategory = new TotalLiteMenu({container: window.document.body});

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
                                update();
                            });
                        });
                    });
                });
            }
        }
    });

    // Context menu for board
    const menuBoard = new TotalLiteMenu({container: window.document.body});
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
                        update();
                    });
                });
            }
        }
    });

    // Right click event
    window.document.body.addEventListener('contextmenu', event => {

        selectedCategory = null;
        selectedBoard = null;
        event.preventDefault();

        for (const element of event.composedPath()) {

            if (element instanceof HTMLElement) {

                // Clicked on category icon
                if (element.classList.contains('dots')) {
                    selectedCategory = element.dataset.category;
                    menuCategory.show(event.clientX, event.clientY);
                }

                // Clicked on board icon
                if (element.classList.contains('board-link-a')) {
                    selectedBoard = element.dataset.board;
                    menuBoard.show(event.clientX, event.clientY);
                }

            }
        }
    });

    const observer = new MutationObserver(async () => {
        observer.disconnect();
        await update();
    });
    observer.observe(app, {childList: true, subtree: true});

    app.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: row;">
            ${renderSidebar(app)}
            ${renderPanels()}
            <div id="boards" class="boards"></div>
        </div>
    `;

};

window.addEventListener('reload', update);
