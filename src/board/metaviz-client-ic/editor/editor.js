// Editor

import { v4 as uuidv4 } from 'uuid';
import { setDoc, getDoc, listAssets, deleteManyAssets } from '@junobuild/core';
import MetavizContextMenuIC from './menu.js';

class MetavizEditorIC extends MetavizEditorBrowser {

    constructor(args) {

        // Viewer constructor (also init events)
        super(args);

        // Get Board ID from URL param
        const getParams = window.location.search.uriToDict();
        if ('board' in getParams) this.id = getParams.board;

        // Create menu
        this.menu = new MetavizContextMenuIC({projectName: this.name});

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

                // Deserialize json                
                if (doc.data.json) {
                    // If error - show alert
                    if ('error' in doc.data.json) alert(doc.data.json.error);
                    // Decode data
                    else metaviz.format.deserialize('text/metaviz+json', doc.data.json);
                }

                // Ready
                this.idle();

                // Empty folder?
                this.checkEmpty();

                // Centre
                metaviz.render.focusBounds();

                // Launch start
                for (const node of metaviz.render.nodes.get('*')) node.start();

                // Update
                metaviz.render.update();
                
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
        this.version ++;

        // Purge old media files
        await this.purge();

        // Clear
        this.history.dirty = false;

        // Spinner
        this.idle();

    }

    /**
     * Delete old media+files
     */

    async purge() {

        // Collect media nodes
        const nodes = [];
        metaviz.render.nodes.get('*').forEach(node => {
            if (['MetavizNodeImage', 'MetavizNodeFile'].includes(node.constructor.name)) nodes.push(node);
        });

        // Collect media files
        const files = await listAssets({
            collection: 'files',
        });

        // Delete expired files
        const hour = 3600 * 1000;
        const expired = 3 * hour * 24;
        const now = new Date().getTime();
        const toDelete = [];
        files.assets.forEach(file => {
            // Find reference in nodes
            const referenced = nodes.some(node => node.params.uri.includes(file.downloadUrl));
            if (!referenced) {
                // Expired
                if (now - Number(file.updated_at / 1000000n) > expired) {
                    console.info('Purging unused', file.fullPath);
                    toDelete.push({
                        collection: 'files',
                        fullPath: file.fullPath
                    });
                }
            }
        });
        await deleteManyAssets({ assets: toDelete });
    }

    /**
     * Create node (copy)
     * nodeType: <string> class name
     * transform: {x: ..., y: ...}
     * params: {param1: ..., param2: ...} [optional]
     */

    nodeAdd(nodeType, transform, params = {}) {

        // Position
        let position = metaviz.render.screen2World(transform);
        if (metaviz.config.snap.grid.enabled) position = this.snapToGrid(position.x, position.y);

        // Create node
        const newNode = metaviz.render.nodes.add({id: crypto.randomUUID(), parent: metaviz.render.nodes.parent, type: nodeType, ...position, params});

        // Update
        newNode.render();
        newNode.update();
        newNode.start();

        // Store
        this.history.clearFuture();
        this.history.store({action: 'add', nodes: [newNode.serialize('transform')]});

        // Link if node chaining is active
        if (this.interaction.chainNode) {
            this.dragLinkEnd(newNode);
            this.interaction.clear();
        }

        // Show info
        this.checkEmpty();

        // Return fres created node
        return newNode;
    }

}

export default MetavizEditorIC;
