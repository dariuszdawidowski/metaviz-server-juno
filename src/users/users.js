import { v4 as uuidv4 } from 'uuid';
import { listDocs, listAssets, setDoc, getDoc, deleteDoc } from '@junobuild/core';
import { renderPanelExpenses, updatePanelExpenses } from '../panels/expenses.js';
import { renderSidebar } from '../panels/sidebar.js';
import { renderTopbar } from '../panels/topbar.js';
import { Component } from '../boost.js';
import { renderAdd } from '../widgets/add.js';
import { addEvent } from '../utils.js';
import { showSpinner, hideSpinner } from '../widgets/spinner.js';

export class Users extends Component {

    async addUser(name) {
        showSpinner();
        await setDoc({
            collection: 'users',
            doc: {
                key: uuidv4(),
                data: {
                    name
                }
            }
        });
        this.update();
        hideSpinner();
    }

    renderUserIcon(user) {

        return `
            <div class="user-icon" data-user="${user.id}">
                <span class="mdi mdi-account"></span>
                <div class="user-name">${user.name}</div>
            </div>
        `;

    }

    renderAllUsers(app, users) {

        return `
            <div class="group">
                <h1>⇢ Users</h1>
                <div class="section">
                    ${users.map((item, index) => {
                        return this.renderUserIcon({ id: item.key, name: item.data.name });
                    }).join('')}
                </div>
                ${renderAdd(app, {text: 'ADD NEW USER', placeholder: 'User name', callback: async (value) => {
                    await this.addUser(value);
                }})}
            </div>
        `;

    }

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
        const organizations = await listDocs({
            collection: 'organizations'
        });
        const groups = await listDocs({
            collection: 'groups'
        });
        const users = await listDocs({
            collection: 'users'
        });

        // Render users in the right column
        if (users.items.length > 0) {
            document.querySelector('#users').innerHTML = `
                ${renderTopbar(`Administration of ${users.items.length} user${users.items.length > 1 ? 's' : ''}`)}
                ${this.renderAllUsers(app, users.items)}
            `;
        }
        // No users yet
        else {
            document.querySelector('#users').innerHTML = `
                <div class="group">
                    <div style="margin: 23px; color: #000; font-size: 14px;">🔔 &nbsp;It looks like there is no users yet. Add your first one below.</div>
                    ${renderAdd(app, {text: 'ADD NEW USER', placeholder: 'User name', callback: async (value) => {
                        await this.addUser(value);
                    }})}
                </div>
            `;
        }

        // Info Panel Consumption and Expenses
        updatePanelExpenses({categories, boards, files});

    }

}
