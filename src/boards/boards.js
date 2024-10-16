import { v4 as uuidv4 } from 'uuid';
import { listDocs, setDoc, getDoc, deleteDoc, deleteManyDocs, listAssets } from '@junobuild/core';
import { renderAdd } from '../widgets/add.js';
import { renderPanelExpenses, updatePanelExpenses } from '../panels/expenses.js';
import { renderSidebar } from '../panels/sidebar.js';
import { renderTopbar } from '../panels/topbar.js';
import { addEvent, padToTwoDigits, getDataset } from '../utils.js';
import { showSpinner, hideSpinner } from '../widgets/spinner.js';
import { Component } from '../boost.js';

export class Boards extends Component {

    async addCategory(name, index) {
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
        this.update();
        hideSpinner();
    }
    
    async addBoard(name, categoryId) {
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
        this.update();
        hideSpinner();
    }

    moveCategory(categoryId, direction) {
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
                                        this.update();
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
    }

    renderRecent(boards) {
    
        return `
            <div class="group">
                <h1>⇢ Recent</h1>
                <div class="section">
                    ${boards.map((item, index) => {
                        return this.renderBoardIcon({ id: item.key, name: item.data.name, updated: Number(item.updated_at / 1000000n) });
                    }).join('')}
                </div>
            </div>
        `;
    
    }
    
    renderBoardIcon(board) {
    
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
    
    }
    
    renderCategory(app, category, boards) {
    
        return `
            <div class="group">
                <h1>⇢ ${category.name}</h1>
                <div class="dots" data-category="${category.id}">...</div>
                <div class="section">
                    ${boards.map((item, index) => {
                        if (item.data.category == category.id) {
                            return this.renderBoardIcon({ id: item.key, name: item.data.name, updated: Number(item.updated_at / 1000000n) });
                        }
                    }).join('')}
                </div>
                ${renderAdd(app, {text: 'ADD NEW BOARD', placeholder: 'Board name', callback: async (value) => {
                    await this.addBoard(value, category.id);
                }})}
            </div>
        `;
    
    }
    
    renderAllBoards(boards) {
    
        return `
            <div class="group">
                <h1>⇢ All boards</h1>
                <div class="section">
                    ${boards.map((item, index) => {
                        return this.renderBoardIcon({ id: item.key, name: item.data.name, updated: Number(item.updated_at / 1000000n) });
                    }).join('')}
                </div>
            </div>
        `;
    
    }
    
    /**
     * Generate HTML structure
     */

    render() {

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
                                    this.update();
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
                            selectedBoard = null;
                            hideSpinner();
                            this.update();
                        });
                    });
                }
            }
        });
    
        super.render(`
            <div style="width: 100%; height: 100%; display: flex; flex-direction: row;">
                ${renderSidebar(app)}
                ${renderPanelExpenses(app)}
                <div id="boards" class="right"></div>
            </div>
        `);
    
        // Left click on a category dots
        // addEvent({
        //     target: app,
        //     selector: '.dots',
        //     type: 'click',
        //     fn: (event) => {
        //         selectedCategory = getDataset(event.target, 'category');
        //         selectedBoard = null;
        //         menuCategory.show(event.clientX, event.clientY);
        //     }
        // });
    
        // Right click on a category dots
        addEvent({
            target: app,
            selector: '.dots',
            type: 'contextmenu',
            fn: (event) => {
                selectedCategory = getDataset(event.target, 'category');
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
                selectedBoard = getDataset(event.target, 'board');
                menuBoard.show(event.clientX, event.clientY);
            }
        });
    
    }

    /**
     * Refresh data and fill HTML
     */
    
    async update () {

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
                ${renderTopbar(`Your resources on ${boards.items.length} boards in ${categories.items.length} categories`)}
                ${this.renderRecent(recentBoards)}
                ${categories.items.toSorted((a, b) => a.data.index - b.data.index).map(item => {
                    return this.renderCategory(app, { id: item.key, name: item.data.name }, boards.items);
                }).join('')}
                <div class="group">
                    ${renderAdd(app, {text: 'ADD NEW CATEGORY', placeholder: 'Category name', sub: false, callback: async (value) => {
                        await this.addCategory(value, categories.items.length);
                    }})}
                </div>
                ${this.renderAllBoards(boards.items)}
            `;
        }
    
        // No categories yet
        else {
            document.querySelector('#boards').innerHTML = `
                <div class="group">
                    <div style="margin: 23px; color: #000; font-size: 14px;">🔔 &nbsp;It looks like everything is still empty. Add your first category, for example "My boards".</div>
                    ${renderAdd(app, {text: 'ADD NEW CATEGORY', placeholder: 'Category name', callback: async (value) => {
                        await this.addCategory(value, categories.items.length);
                    }})}
                </div>
            `;
        }
    
        // Info Panel Consumption and Expenses
        updatePanelExpenses({categories, boards, files});
    
    }
    
}
