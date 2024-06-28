// File data transfer

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

    sendBlob(file, node, onLoad = null) {
        console.log('sendBlob...')
    }

}

export default MetavizExchangeIC;
