// File data transfer

import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from '@junobuild/core';

class MetavizExchangeIC extends MetavizExchange {

    /**
     * Generic file upload
     * file: File object
     * position: {x,y} on board
     * node: assign to exising node <MetavizNode object>
     */

    processBlob(file, position, node = null) {

        // Exceed max file size
        if (file.size > global.cache['MetavizNodeFile']['maxSize']) {
            alert(`Exceed maximum file size! Limit is ${global.cache['MetavizNodeFile']['maxSize'] / 1024 / 1024 / 1024} GB.`);
            return;
        }

        // Pick proper icon according to type
        const fileIcon = this.detectIcon(file);

        // Accept given node?
        if (node) {
            if (['MetavizNodeFile', 'MetavizNodeImage'].includes(node.constructor.name)) {
                if (node.params.uri) node = null;
            }
            else {
                node = null;
            }
        }

        // Create new node
        if (!node) {

            // Create Image Node
            if (this.detectImage(file.type)) {
                node = metaviz.editor.nodeAdd('MetavizNodeImage', position, {style: 'minimal'});
            }

            // Create File Node
            else {
                node = metaviz.editor.nodeAdd('MetavizNodeFile', position, {name: file.name, filename: file.name, mime: file.type, size: file.size});
            }

        }

        // Upload
        if (node) this.sendBlob(file, node);
    }

    /**
     * Sending data to server
     * file: File object
     * node: MetavizNode object
     * onLoad: callback (optional)
     */

    async sendBlob(file, node, onLoad = null) {

        // Show spinner
        node.controls.spinner.show();

        const result = await uploadFile({
            data: file,
            description: `{"board": "${metaviz.editor.id}"}`,
            collection: 'files',
            token: uuidv4()
        });

        // Set URI (file/image) and resolution (image)
        node.params.set('uri', result.downloadUrl);
        if (this.detectImage(file.type)) {
            node.options.uri.set(result.downloadUrl);
            // node.params.set('resX', json.resX);
            // node.params.set('resY', json.resY);
            // node.params.set('rotate', json.rotate);
            metaviz.editor.history.store({
                action: 'param',
                node: {id: node.id},
                params: {uri: result.downloadUrl},
            });
        }

        // Hide spinner
        node.controls.spinner.hide();

        // Callback
        if (onLoad) onLoad();
    }

}

export default MetavizExchangeIC;
