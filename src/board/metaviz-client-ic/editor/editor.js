// Editor

import { v4 as uuidv4 } from 'uuid';
import { setDoc, getDoc, listDocs } from '@junobuild/core';

class MetavizEditorIC extends MetavizEditorBrowser {

    constructor(args) {

        // Viewer constructor (also init events)
        super(args);

        // Get Board ID from URL param
        const getParams = window.location.search.uriToDict();
        if ('board' in getParams) this.id = getParams.board;

        // Create menu
        //this.menu = new MetavizContextMenuIC({projectName: this.name});

        // Focus on canvas
        metaviz.render.container.focus();

    }

    /**
     * Open diagram file
     */

    async open() {

        if (this.id) {

            this.busy();

            const doc = await getDoc({
                collection: 'boards',
                key: this.id
            });

            if (doc) {

                // Set properties
                this.setBoardName(doc.data.name);
                this.category = doc.data.category;
                this.version = doc.version;

                // If error - show alert
                if ('error' in doc.data.json) alert(doc.data.json.error);

                // Decode data
                metaviz.format.deserialize('text/metaviz+json', doc.data.json);

                // Ready
                this.idle();

                // Launch start
                for (const node of metaviz.render.nodes.get('*')) node.start();

                // Dispatch final event
                metaviz.events.call('on:loaded');

            }

            else {
                this.idle();
                alert('This board does not exist! Check your URL.')
            }

        }
    }

    /**
     * Save diagram file
     */

    async save() {

        // Spinner
        this.busy();

        // Collect JSON data
        const json = metaviz.format.serialize('text/metaviz+json', metaviz.render.nodes.get('*'));

        // Send
        await setDoc({
            collection: 'boards',
            doc: {
                key: json.id,
                data: {
                    category: this.category,
                    name: this.name,
                    json
                },
                version: this.version
            }
        });

        // Spinner
        this.idle();

    }

}

export default MetavizEditorIC;