import { listDocs, listAssets } from '@junobuild/core';
import { renderPanelExpenses, updatePanelExpenses } from '../panels/expenses.js';
import { renderSidebar } from '../panels/sidebar.js';
import { renderTopbar } from '../panels/topbar.js';
import { Component } from '../boost.js';

export class Users extends Component {

    render() {

        super.render(`
            <div style="width: 100%; height: 100%; display: flex; flex-direction: row;">
                ${renderSidebar(app)}
                ${renderPanelExpenses(app)}
                <div id="users" class="right"></div>
            </div>
        `);
    
    }

    async update() {

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
    
        // Info Panel Consumption and Expenses
        updatePanelExpenses({categories, boards, files});
    
        document.querySelector('#users').innerHTML = `
            ${renderTopbar(`Administration of 2 organizations with 10 groups and 20 users`)}
        `;
    
    }

}
