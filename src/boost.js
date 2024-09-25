/**
 * Base component for rendering
 * v 0.1.0
 */

export class Component {

    constructor(app) {
        this.app = app;
        window.addEventListener('reload', this.update.bind(this));
    }

    render(html) {

        // Changes observer
        const observer = new MutationObserver(async () => {
            observer.disconnect();
            await this.update();
        });
        observer.observe(this.app, {childList: true, subtree: true});

        // Inject HTML
        this.app.innerHTML = html;

    }

    async update() {

    }

}