/**
 * Metaviz Node File
 * (c) 2009-2024 Dariusz Dawidowski, All Rights Reserved.
 */

class MetavizNodeFile extends MetavizNode {

    constructor(args) {
        super(args);

        // Meta defaults
        if (!('name' in this.params)) this.params['name'] = ('name' in args.params) ? args.params.name : '';
        if (!('filename' in this.params)) this.params['filename'] = ('filename' in args.params) ? args.params.filename : '';
        if (!('uri' in this.params)) this.params['uri'] = '';
        if (!('icon' in this.params)) this.params['icon'] = ('icon' in args.params) ? args.params.icon : 'mdi-file';
        if (!('mime' in this.params)) this.params['mime'] = ('mime' in args.params) ? args.params.mime : '';
        if (!('size' in this.params)) this.params['size'] = 0;

        // Migrate
        if (this.params['icon'] == 'fa-file') this.params['icon'] = 'mdi-file';

        // Size
        this.setSize({width: 80, height: 80});

        // Classes
        this.element.classList.add('metaviz-node-icon');

        // Controls
        this.addControls({

            // Icon control
            icon: new MetavizControlIcon('mdi', this.params.icon),

            // Input control: Under Icon Name
            name: new MetavizControlInput({
                name: 'name',
                placeholder: _('File'),
                value: this.params.name,
                onChange: (value) => {
                    metaviz.editor.history.store({
                        action: 'param',
                        node: {id: this.id},
                        params: {name: value},
                        prev: {name: this.params.name}
                    });
                    this.params.set('name', value);
                }
            }),

            // Input control: Real file name
            filename: new MetavizControlInput({name: 'filename', value: this.params.filename}),

            // Input control: File size
            size: new MetavizControlInput({name: 'size', value: `(${this.params.size.bytes2Human()})`}),

            // Spinner control
            spinner: new MetavizControlSpinner()

        });
        this.controls.filename.edit(false);
        this.controls.size.edit(false);
        this.controls.filename.hide();
        this.controls.size.hide();

        // Menu Options
        this.addOptions({

            // Name in menu
            name: new TotalProMenuInput({
                placeholder: 'Name',
                value: this.params.name,
                onChange: (value) => {
                    metaviz.editor.history.store({
                        action: 'param',
                        node: {id: this.id},
                        params: {name: value},
                        prev: {name: this.params.name}
                    });
                    this.params.set('name', value);
                }
            }),

            // URI in menu
            uri: new TotalProMenuInput({
                placeholder: 'File URI',
                value: this.params.uri,
                onChange: (value) => {
                    // Undo/Sync
                    metaviz.editor.history.store({
                        action: 'param',
                        node: {id: this.id},
                        params: {uri: value, filename: 'External link'},
                        prev: {uri: this.params.uri, filename: this.params.filename}
                    });
                    // New file
                    this.params.set('uri', value);
                    // Set values
                    this.controls.filename.set('External link');
                }
            }),

            // Download File
            download: new TotalProMenuOption({
                icon: () => this.params.uri ? '<span class="mdi mdi-cloud-download"></span>' : '<span class="mdi mdi-cloud-upload"></span>',
                text: () => this.params.uri ? `Download (${this.params.filename == 'External link' ? 'link' : this.params.size.bytes2Human()})` : 'Upload file',
                onChange: () => {
                    // Download
                    if (this.params.uri) {
                        metaviz.exchange.downloadFile({
                            path: this.fixURI(this.params.uri),
                            name: this.params.filename
                        });
                    }
                    // Upload
                    else {
                        this.uploadFile();
                    }
                    // Close menu
                    metaviz.editor.menu.hide();
                }
            })

        });

        // Sockets
        this.addSockets();

        // Meta setter
        this.params.set = (key, value) => {
            this.params[key] = value;
            switch (key) {
                case 'name':
                    this.controls.name.set(value);
                    this.options.name.set(value);
                    break;
                case 'filename':
                    this.controls.filename.set(value);
                    break;
                case 'size':
                    this.controls.size.set(value.bytes2Human());
                    this.options.download.setName(`Download (${this.params.filename == 'External link' ? 'link' : value.bytes2Human()})`);
                    break;
            }
        }
    }

    /**
     * Show/hide filename and size
     */

    select() {
        super.select();
        this.controls.filename.show();
        if (this.params.size > 0) this.controls.size.show();
    }

    deselect() {
        super.deselect();
        this.controls.filename.hide();
        this.controls.size.hide();
    }

    /**
     * Upload file
     */

    async uploadFile() {
        // File object
        let file = null;

        // Open file dialog
        try {
            const [fileHandle] = await window.showOpenFilePicker();
            file = await fileHandle.getFile();
        }
        catch (error) {
        }

        // Send file
        if (file) {
            metaviz.exchange.sendBlob(file, this, () => {
                this.options.download.setIcon('<span class="mdi mdi-cloud-download"></span>');
                this.options.download.setName(`Download (${this.params.size.bytes2Human()})`);
            });
            metaviz.editor.history.store({
                action: 'param',
                node: {id: this.id},
                params: {
                    name: file.name,
                    filename: file.name,
                    mime: file.type,
                    size: file.size
                },
                prev: {
                    name: this.params.name,
                    filename: this.params.filename,
                    mime: this.params.mime,
                    size: this.params.size
                }
            });
            this.params.set('name', file.name);
            this.params.set('filename', file.name);
            this.params.set('mime', file.type);
            this.params.set('size', file.size);
        }
    }

    /**
     * Click: upload file if empty
     */

    click() {
        if (!this.params.uri && this.focused) this.uploadFile();
    }

    /**
     * Doubleclick - open in new tab
     */

    dblclick() {

        // By mimetype
        if (['application/pdf',
             'application/json',
             'text/xml',
             'image/.*',
             'video/.*',
            ].find(mime => this.params.mime.match(mime))) window.open(this.fixURI(this.params.uri));

        // By filename extension
        else if (['pdf',
             'json',
             'xml',
             'png',
             'jpg',
             'webp',
             'webm',
            ].find(ext => this.params.filename.ext(ext))) window.open(this.fixURI(this.params.uri));

        // By URI extension
        else if (['pdf',
             'json',
             'xml',
             'png',
             'jpg',
             'webp',
             'webm',
            ].find(ext => this.params.uri.ext(ext))) window.open(this.fixURI(this.params.uri));
    }

    /**
     * Pipeline
     */

    pipeline() {
        const stream = super.pipeline();
        if (this.params.uri != '') {
            metaviz.ajax.in.recv({params: {}, server: this.fixURI(this.params.uri), mimetype: this.params.mime}).then(data => {
                stream.add({text: data});
                stream.mime = this.params.mime;
                this.pipelineSend(stream);
            });
        }
        return stream;
    }

    /**
     * Search meta data for given text
     */

    search(text) {
        if (this.params.name.toLowerCase().includes(text.toLowerCase())) return true;
        if (this.params.filename.toLowerCase().includes(text.toLowerCase())) return true;
        return false;
    }

    /**
     * Short description of the contents
     */

    synopsis(length = 40) {
        return this.params.name.synopsis(length);
    }

    /**
     * Serialize
     */

    serialize() {
        // Under Icon Name
        this.params.name = this.controls.name.get();
        this.params.icon = this.controls.icon.name;
        return super.serialize();
    }

    /**
     * Export node to different format
     */

    export(format) {

        if (format == 'miniature') {
            return `<div class="miniature miniature-node-clipart" data-id="${this.id}"><span class="mdi mdi-file"></span><span style="position: absolute; font-size: 6px; color: white">${this.params.name.trim().slice(0,10)}<span></div>`;
        }

        else if (format == 'image/svg+xml') {
            return ``;
        }

        return null;
    }

}

global.registry.add({proto: MetavizNodeFile, name: 'File', icon: '<span class="mdi mdi-file"></span>'});
