// Metaviz main app

class MetavizClientIC extends Metaviz {

    /**
     * Constructor
     */

    constructor() {
        super();

        // Data URL
        this.url['data'] = null;
        // Upload files/images URL
        this.url['media'] = null;

        // Meta info
        this.agent.server = document.querySelector('meta[name="metaviz:agent:server"]')?.content;
        this.url.data = document.querySelector('meta[name="metaviz:url:data"]')?.content;
        this.url.media = document.querySelector('meta[name="metaviz:url:media"]')?.content;
    }

    /**
     * Init everything
     * @param containerID: string with id of main container
     * @param spinnerID: string with id of logo (optional)
     */

    init(containerID, spinnerID) {

        // Container
        this.container.id = containerID;
        this.container.element = document.getElementById(containerID);
        this.container.spinnerID = spinnerID;

        // Contructors (order matters)
        this.config = new MetavizConfig();
        this.state = new MetavizViewerState();
        this.format = new MetavizFormat();
        this.format.register('text/mvstack+xml', {
            in: new MetavizInStack(),
            out: new MetavizOutStack()
        });
        this.format.register('text/metaviz+json', {
            in: new MetavizInJSON(),
            out: new MetavizOutJSON()
        });
        this.format.register('image/svg+xml', {
            in: null,
            out: new MetavizOutSVG()
        });
        // TODO: remove storage
        this.storage = {
            filesystem: new MetavizFilesystem(),
            db: new MetavizIndexedDB()
        };
        this.render = new MetavizEditorRender({
            container: this.container.element,
            nodes: new MetavizNodesManager(),
            links: new MetavizLinksManager()
        });
        this.ajax = {
            in: new MetavizInAjax(),
            out: null //new MetavizOutAjax()
        };
        this.exchange = new MetavizExchange();
        this.events = new MetavizEventManager();
        this.editor = new MetavizEditorBrowser();
    }

}

export default MetavizClientIC;
