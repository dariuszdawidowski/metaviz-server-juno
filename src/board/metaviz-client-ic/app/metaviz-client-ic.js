// Metaviz main app

import MetavizEditorIC from '../editor/editor.js';
import MetavizExchangeIC from '../editor/exchange.js';

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
        this.exchange = new MetavizExchangeIC();
        this.events = new MetavizEventManager();
        this.editor = new MetavizEditorIC();
    }

    /**
     * Start everything
     * @param boardID: optional string with uuid of the board to fetch (also can be passed in url get param)
     */

    start(boardID = null) {

        // Start editor
        this.editor.start();

        // For browser
        if (this.agent.client == 'browser') {

            // Theme
            const theme = localStorage.getItem('metaviz.config.theme') || 'Iron';
            this.container.element.classList.add('theme-' + theme.toLowerCase());
            for (const [key, value] of Object.entries(global.registry.themes[theme].vars)) {
                document.documentElement.style.setProperty(key, value);
            }

            // Cookie info
            if (this.agent.server != '') {
                this.editor.showCookieBubble({
                    text: `${_('Site use cookies')} <a href='https://www.metaviz.net/privacy-policy/clientpro/' target='_blank'>${_('Click here to read the Privacy Policy')}.</a> <input type="checkbox" onchange="metaviz.editor.hideCookieBubbleForever(this)"> ${_('Dont show again')}`,
                    position: 'bottom-center'
                });
            }

            // Server
            if (this.agent.server) {

                // Initial load board json data
                this.editor.open(boardID);

            }

        }
    }

}

export default MetavizClientIC;
