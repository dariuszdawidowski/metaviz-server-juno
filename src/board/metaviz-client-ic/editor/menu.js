
export default class MetavizContextMenuIC extends MetavizContextMenu {

    build(args) {

        const {projectName = ''} = args;

        // Add node
        this.subAddNode = new TotalProSubMenu({
            id: 'menu-add-node',
            text: _('Add node')
        });
        this.panel.left.add(this.subAddNode);

        // Generate list of available nodes
        const menuAddNode = this.generateNodesList();

        // Edit selection
        const subEditSelection = new TotalProSubMenu({
            id: 'menu-edit-selection',
            text: _('Edit selection')
        });
        this.panel.left.add(subEditSelection);

        // Navigation
        const subNavigation = new TotalProSubMenu({
            id: 'menu-navigation',
            text: _('Navigation')
        });
        this.panel.left.add(subNavigation);
        subNavigation.add(new TotalProMenuGroup({
            text: _('Navigation'),
            widgets: [

                // Navigation: Centre Board
                new TotalProMenuOption({
                    icon: '<span class="mdi mdi-image-filter-center-focus"></span>',
                    text: _('Centre'),
                    onChange: () => {
                        this.hide();
                        metaviz.render.focusBounds();
                    }
                }),

            ]
        }));

        // Node options
        subEditSelection.add(new TotalProMenuGroup({
            id: 'menu-node-options',
            text: _('Node options'),
            widgets: []
        }));

        // Node local options
        subEditSelection.add(new TotalProMenuGroup({
            id: 'menu-node-local-options',
            text: _('Node local options'),
            widgets: []
        }));

        // Node edit
        subEditSelection.add(new TotalProMenuGroup({
            id: 'menu-node-functions',
            text: _('Node functions'),
            widgets: []
        }));

        // Lock movement
        subEditSelection.add(new TotalProMenuSwitch({
            id: 'menu-node-lock-movement',
            text: _('Lock movement'),
            value: false,
            onChange: (value) => {
                if (value) metaviz.editor.selection.getFocused().lock('move');
                else metaviz.editor.selection.getFocused().unlock('move');
            }
        }));

        // Lock content
        subEditSelection.add(new TotalProMenuSwitch({
            id: 'menu-node-lock-content',
            text: _('Lock content'),
            value: false,
            onChange: (value) => {
                if (value) metaviz.editor.selection.getFocused().lock('content');
                else metaviz.editor.selection.getFocused().unlock('content');
            }
        }));

        // Lock delete
        subEditSelection.add(new TotalProMenuSwitch({
            id: 'menu-node-lock-delete',
            text: _('Lock delete'),
            value: false,
            onChange: (value) => {
                if (value) metaviz.editor.selection.getFocused().lock('delete');
                else metaviz.editor.selection.getFocused().unlock('delete');
            }
        }));

        // Link / Unlink
        subEditSelection.add(new TotalProMenuOption({
            id: 'menu-node-link',
            icon: '<span class="mdi mdi-link-variant"></span>',
            text: _('Link'),
            shortcut: [17, 76],
            onChange: () => {
                metaviz.editor.linkToggleSelected();
                this.hide();
            }
        }));

        // ----
        subEditSelection.add(new TotalProMenuSeparator());

        // Arrange
        subEditSelection.add(new TotalProMenuOption({
            id: 'menu-node-sort',
            icon: '<span class="mdi mdi-arrange-bring-to-front"></span>',
            text: _('Sort'),
            onChange: () => {
                metaviz.editor.arrangeSort();
                this.hide();
            }
        }));
        subEditSelection.add(new TotalProMenuOption({
            id: 'menu-node-align-horizontal',
            icon: '<span class="mdi mdi-focus-field-horizontal"></span>',
            text: _('Align Horizontal'),
            onChange: () => {
                metaviz.editor.arrangeHorizontal();
                this.hide();
            }
        }));
        subEditSelection.add(new TotalProMenuOption({
            id: 'menu-node-align-vertical',
            icon: '<span class="mdi mdi-focus-field-vertical"></span>',
            text: _('Align Vertical'),
            onChange: () => {
                metaviz.editor.arrangeVertical();
                this.hide();
            }
        }));
        subEditSelection.add(new TotalProMenuOption({
            id: 'menu-node-move-foreground',
            icon: '<span class="mdi mdi-chevron-up"></span>',
            text: _('Move to Foreground'),
            onChange: () => {
                metaviz.editor.arrangeZ(1);
                this.hide();
            }
        }));
        subEditSelection.add(new TotalProMenuOption({
            id: 'menu-node-move-background',
            icon: '<span class="mdi mdi-chevron-down"></span>',
            text: _('Move to Background'),
            onChange: () => {
                metaviz.editor.arrangeZ(-1);
                this.hide();
            }
        }));
        subEditSelection.add(new TotalProMenuOption({
            id: 'menu-node-reset-translations',
            icon: '<span class="mdi mdi-circle-off-outline"></span>',
            text: _('Reset Translations'),
            onChange: () => {
                metaviz.editor.arrangeReset();
                this.hide();
            }
        }));

        // Save
        this.panel.left.add(new TotalProMenuOption({
            id: 'menu-file-save',
            icon: '<span class="mdi mdi-content-save"></span>',
            text: _('Save'),
            shortcut: [17, 83],
            onChange: () => {
                this.hide();
                if (metaviz.editor.history.isDirty()) metaviz.editor.save();
            }
        }));

        // ----
        this.panel.left.add(new TotalProMenuSeparator());

        // Undo
        this.panel.left.add(new TotalProMenuOption({
            id: 'menu-undo',
            icon: '<span class="mdi mdi-undo"></span>',
            text: _('Undo'),
            shortcut: [17, 90],
            onChange: () => {
                this.hide();
                metaviz.editor.history.undo();
            }
        }));

        // Redo
        this.panel.left.add(new TotalProMenuOption({
            id: 'menu-redo',
            icon: '<span class="mdi mdi-redo"></span>',
            text: _('Redo'),
            shortcut: [17, 16, 90],
            onChange: () => {
                this.hide();
                metaviz.editor.history.redo();
            }
        }));

        // ----
        this.panel.left.add(new TotalProMenuSeparator());

        // Cut
        this.panel.left.add(new TotalProMenuOption({
            id: 'menu-cut',
            icon: '<span class="mdi mdi-content-cut"></span>',
            text: _('Cut'),
            shortcut: [17, 88],
            onChange: () => {
                metaviz.editor.cut();
                this.hide();
            }
        }));

        // Copy
        this.panel.left.add(new TotalProMenuOption({
            id: 'menu-copy',
            icon: '<span class="mdi mdi-content-copy"></span>',
            text: _('Copy'),
            shortcut: [17, 67],
            onChange: () => {
                metaviz.editor.copy();
                this.hide();
            }
        }));

        // Paste
        this.panel.left.add(new TotalProMenuOption({
            id: 'menu-paste',
            icon: '<span class="mdi mdi-content-paste"></span>',
            text: _('Paste'),
            shortcut: [17, 86],
            onChange: () => {
                metaviz.editor.paste();
                this.hide();
            }
        }));

        // Duplicate
        this.panel.left.add(new TotalProMenuOption({
            id: 'menu-duplicate',
            icon: '<span class="mdi mdi-content-duplicate"></span>',
            text: _('Duplicate'),
            shortcut: [17, 68],
            onChange: () => {
                metaviz.editor.duplicate();
                this.hide();
            }
        }));

        // Select All Nodes / Text
        this.panel.left.add(new TotalProMenuOption({
            id: 'menu-select-all',
            icon: '<span class="mdi mdi-select-all"></span>',
            text: _('Select All'),
            shortcut: [17, 65],
            onChange: () => {
                if (this.panel.left.find('menu-select-all').getName() == _('Select All Nodes')) {
                    metaviz.editor.selection.all();
                }
                else if (this.panel.left.find('menu-select-all').getName() == _('Select All Text')) {
                    const edit = metaviz.editor.selection.getFocused().getEditingControl();
                    if (edit) edit.setSelection();
                }
            }
        }));

        // ----
        this.panel.left.add(new TotalProMenuSeparator());

        this.panel.left.add(new TotalProMenuOption({
            id: 'menu-delete',
            icon: '<span class="mdi mdi-delete-forever"></span>',
            text: _('Delete'),
            onChange: () => {
                metaviz.editor.nodeDeleteSelected();
                this.hide();
            }
        }));

        // ----
        this.panel.left.add(new TotalProMenuSeparator());

        // Project Settings
        let subSettings = null;
        if (metaviz.agent.client != 'app') {
            subSettings = new TotalProSubMenu({
                id: 'menu-settings',
                text: _('Settings')
            });
            this.panel.left.add(subSettings);
            subSettings.add(new TotalProMenuGroup({
                text: _('Project settings'),
                widgets: [

                    // Project name
                    new TotalProMenuInput({
                        id: 'menu-board-name',
                        placeholder: _('Board name'),
                        value: projectName,
                        onChange: (value) => {
                            // Undo/Sync
                            metaviz.editor.history.store({
                                action: 'board',
                                name: value,
                                namePrev: metaviz.editor.getBoardName()
                            });
                            // Set new name
                            metaviz.editor.setBoardName(event.target.value);
                        }
                    }),

                ]
            }));

            // On update project name
            metaviz.events.listen('update:boardname', (event) => {
                const menuInput = this.panel.left.find('menu-board-name');
                if (menuInput) menuInput.set(event.detail);
            }, false);

            // ----
            subSettings.add(new TotalProMenuSeparator());

            // Browser Settings
            subSettings.add(new TotalProMenuGroup({
                text: _('Local settings') + ':',
                widgets: []
            }));

            // Navigation
            subSettings.add(new TotalProMenuGroup({
                text: _('Navigation'),
                widgets: [

                    // Swipe
                    new TotalProMenuSelect({
                        placeholder: _('Primal pointer device'),
                        options: {
                            'pan': {icon: '', text: _('Primary device: Touchpad')},
                            'zoom': {icon: '', text: _('Primary device: Mouse')}
                        },
                        value: metaviz.config.touchpad.swipe.get(),
                        onChange: (value) => {
                            metaviz.config.touchpad.swipe.set(value);
                            metaviz.config.save();
                            metaviz.editor.restartViewerMouseEvents();
                        }
                    }),

                    // Desktop Click
                    new TotalProMenuSelect({
                        placeholder: _('Click on board'),
                        options: {
                            'pan': {icon: '', text: _('Click on board: Pan view')},
                            'box': {icon: '', text: _('Click on board: Selection')}
                        },
                        value: metaviz.config.pointer.desktop.get(),
                        onChange: (value) => {
                            metaviz.config.pointer.desktop.set(value);
                            metaviz.config.save();
                        }
                    }),

                ]
            }));

            // Helpers
            subSettings.add(new TotalProMenuGroup({
                text: _('Helpers'),
                widgets: [

                    // Auto-Align
                    new TotalProMenuSwitch({
                        text: _('Auto-Align'),
                        value: metaviz.config.snap.grid.enabled,
                        onChange: (value) => {
                            metaviz.config.snap.grid.enabled = value;
                            metaviz.config.save();
                        }
                    }),

                ]
            }));

            // Look & feel
            const themes = {};
            const themeClasses = [];
            for (const [key, value] of Object.entries(global.registry.themes)) {
                themes[key] = {icon: '', text: _('Theme') + ': ' + _(key)};
                themeClasses.push('theme-' + global.registry.themes[key].name.toLowerCase());
            }
            subSettings.add(new TotalProMenuGroup({
                text: _('Look & feel'),
                widgets: [

                    new TotalProMenuSelect({
                        placeholder: _('Select color theme'),
                        options: themes,
                        value: metaviz.config.theme.get(),
                        onChange: (value) => {
                            metaviz.container.element.classList.remove(...themeClasses);
                            metaviz.container.element.classList.add('theme-' + value.toLowerCase());
                            for (const [key, theme] of Object.entries(global.registry.themes[value].vars)) {
                                document.documentElement.style.setProperty(key, theme);
                            }
                            metaviz.config.theme.set(value);
                            metaviz.config.save();
                        }
                    }),

                ]
            }));

            // Permissions
            subSettings.add(new TotalProMenuGroup({
                text: _('Permissions'),
                widgets: [

                    // Allow system clipboard
                    (metaviz.system.features.clipboardApi ?
                    new TotalProMenuSwitch({
                        id: 'menu-settings-allow-clipboard',
                        text: _('Allow system clipboard'),
                        value: false,
                        onChange: (value) => {
                            if (value == true) navigator.clipboard.readText();
                            else alert(_('Disable clipboard'));
                            this.hide();
                        }
                    }) : null),

                    // Allow cookie info bar
                    new TotalProMenuSwitch({
                        text: _('Show cookie info'),
                        value: metaviz.config.cookies.show,
                        onChange: (value) => {
                            metaviz.config.cookies.show = value;
                            metaviz.config.save();
                        }
                    }),

                    // Check for updates
                    ((metaviz.url.update != '') ?
                    new TotalProMenuSwitch({
                        text: _('Check for updates'),
                        value: metaviz.config.updates.check,
                        onChange: (value) => {
                            metaviz.config.updates.check = value;
                            metaviz.config.save();
                        }
                    }) : null),

                ]
            }));

            // Updates
            if (metaviz.url.update != '') {
            }

        } // Project Settings

        // Help selection
        const subHelp = new TotalProSubMenu({
            id: 'menu-help',
            text: _('Help')
        });
        this.panel.left.add(subHelp);
        subHelp.add(new TotalProMenuGroup({
            text: `Metaviz ${metaviz.version}\nBuild ${metaviz.build}`,
            widgets: [

                // Help: GitHub Page
                new TotalProMenuOption({
                    text: _('GitHub page'),
                    icon: '<span class="mdi mdi-open-in-new"></span>',
                    onChange: () => window.open('https://github.com/dariuszdawidowski/metaviz-server-juno')
                }),

                // Help: Submit issue
                new TotalProMenuOption({
                    text: _('Submit issue'),
                    icon: '<span class="mdi mdi-bug"></span>',
                    onChange: () => window.open('https://github.com/dariuszdawidowski/metaviz-server-juno/issues')
                }),

            ]
        }));

        // Simulate scroll event
        this.element.addEventListener('scroll', (event) => {
            this.subAddNode.panel.scroll(0, this.subAddNode.panel.scrollTop - event.detail);
            subEditSelection.panel.scroll(0, subEditSelection.panel.scrollTop - event.detail);
            subNavigation.panel.scroll(0, subNavigation.panel.scrollTop - event.detail);
            if (subSettings) subSettings.panel.scroll(0, subSettings.panel.scrollTop - event.detail);
            subHelp.panel.scroll(0, subHelp.panel.scrollTop - event.detail);
        });

    }

    /**
     * Prepare and show context menu
     * args:
     * x: left
     * y: top
     * target: clicked DOM element
     */

    show(args) {
        super.show(args);

        // Enable Save
        if (metaviz.editor.history.isDirty()) {
            this.panel.left.find('menu-file-save')?.enable();
        }
        else {
            this.panel.left.find('menu-file-save')?.disable();
        }

    }

}

