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
        // const docs = await listDocs({
        //     collection: 'boards'
        // });
        // console.log('docs', docs);

        if (this.id) {
            const doc = await getDoc({
                collection: 'boards',
                key: this.id
            });
            if (doc) {
                this.setBoardName(doc.data.name);
                this.category = doc.data.category;
                console.log('doc', doc);            
            }
            else {
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
                }
            }
        });

        // Spinner
        this.idle();

    }

}

export default MetavizEditorIC;
