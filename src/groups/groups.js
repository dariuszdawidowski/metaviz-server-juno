import { v4 as uuidv4 } from 'uuid';
import { listDocs, listAssets, setDoc, getDoc, deleteDoc } from '@junobuild/core';
import { renderPanelExpenses, updatePanelExpenses } from '../panels/expenses.js';
import { renderSidebar } from '../panels/sidebar.js';
import { renderTopbar } from '../panels/topbar.js';
import { Component } from '../boost.js';
import { renderAdd } from '../widgets/add.js';
import { addEvent, getDataset } from '../utils.js';
import { showSpinner, hideSpinner } from '../widgets/spinner.js';

export class Groups extends Component {

    async addOrganization(name, index) {
        showSpinner();
        await setDoc({
            collection: 'organizations',
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

    async addGroup(name, organizationId) {
        showSpinner();
        await setDoc({
            collection: 'groups',
            doc: {
                key: uuidv4(),
                data: {
                    name,
                    organization: organizationId
                }
            }
        });
        this.update();
        hideSpinner();
    }

    renderGroupIcon(group) {

        return `
            <div class="group-icon" data-group="${group.id}">
                <span class="mdi mdi-account-group"></span>
                <div class="group-name">${group.name}</div>
            </div>
        `;

    }

    renderGroup(app, args) {
    
        return `
            <div class="group">
                <h1>⇢ ${args.name}</h1>
                <div class="section">
                </div>
                ${renderAdd(app, {text: 'ASSIGN USER', placeholder: 'User name', sub: false, callback: async (value) => {
                }})}
                ${renderAdd(app, {text: 'ASSIGN BOARD', placeholder: 'Board name', sub: false, callback: async (value) => {
                }})}
            </div>
        `;
    
    }

    renderOrganization(app, args) {

        // List groups
        if (args.groups.length) {
            return `
                <h1>⇢ ${args.name}</h1>
                ${args.groups.map((item, index) => {
                    return this.renderGroup(app, { id: item.key, name: item.data.name, organization: args.id });
                }).join('')}
                <div class="group">
                    ${renderAdd(app, {text: 'ADD NEW GROUP', placeholder: 'Group name', sub: false, callback: async (value) => {
                        await this.addGroup(value, args.id);
                    }})}
                </div>
            `;
        }

        // No groups yet
        else {
            return `
                <h1>⇢ ${args.name}</h1>
                <div class="group">
                    ${renderAdd(app, {text: 'ADD NEW GROUP', placeholder: 'Group name', sub: false, callback: async (value) => {
                        await this.addGroup(value, args.id);
                    }})}
                </div>
            `;
        }
    
    }

    render() {

        // Selected group id by menu
        let selectedGroup = null;

        // Context menu for group
        const menuGroup = new TotalLiteMenu({container: document.body});
        menuGroup.addItem({
            parent: 'root',
            id: 'edit-group',
            name: '✏️ Edit group name',
            onClick: () => {
            }
        });
        menuGroup.addItem({
            parent: 'root',
            id: 'del-group',
            name: '❌ Delete group',
            onClick: () => {
                if (confirm('Are you sure to delete this group?')) {
                    showSpinner();
                    getDoc({
                        collection: 'groups',
                        key: selectedGroup
                    }).then(myDoc => {
                        deleteDoc({
                            collection: 'groups',
                            doc: myDoc
                        }).then(() => {
                            selectedGroup = null;
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
                <div id="groups" class="right"></div>
            </div>
        `);

        // Right click on an icon
        addEvent({
            target: app,
            selector: '.group-icon',
            type: 'contextmenu',
            fn: (event) => {
                selectedGroup = getDataset(event.target, 'group');
                menuGroup.show(event.clientX, event.clientY);
            }
        });
    
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

        // Render organizations+groups right column
        if (organizations.items.length > 0) {
            document.querySelector('#groups').innerHTML = `
                ${renderTopbar(`Administration of ${groups.items.length} groups in ${organizations.items.length} organization${organizations.items.length > 1 ? 's' : ''}`)}
                ${organizations.items.toSorted((a, b) => a.data.index - b.data.index).map(item => {
                    return this.renderOrganization(app, {
                        id: item.key,
                        name: item.data.name,
                        groups: groups.items.filter(group => group.data.organization == item.key)
                    });
                }).join('')}
                <div class="group">
                    ${renderAdd(app, {text: 'ADD NEW ORGANIZATION', placeholder: 'Organization name', sub: false, callback: async (value) => {
                        await this.addOrganization(value, organizations.items.length);
                    }})}
                </div>
            `;
        }

        // No organizations yet
        else {
            document.querySelector('#groups').innerHTML = `
                <div class="group">
                    <div style="margin: 23px; color: #000; font-size: 14px;">🔔 &nbsp;It looks like there is no organization yet. Add your first one, usually it's a name of your company.</div>
                    ${renderAdd(app, {text: 'ADD NEW ORGANIZATION', placeholder: 'Organization name', callback: async (value) => {
                        await this.addOrganization(value, organizations.items.length);
                    }})}
                </div>
            `;
        }

        // Info Panel Consumption and Expenses
        updatePanelExpenses({categories, boards, files});

    }

}
