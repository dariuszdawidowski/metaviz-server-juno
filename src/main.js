import { authSubscribe, initSatellite } from '@junobuild/core';
import { renderBoard } from './board/render.js';
import { renderBoards } from './boards/boards.js';
import { renderUsers } from './users/users.js';
import { renderLogin } from './login/login.js';
import '../style.css';

/**
 * Global listener. When the user sign-in or sign-out, we re-render the app.
 */

authSubscribe((user) => {
    const app = document.querySelector('#app');

    if (user === null || user === undefined) {
        renderLogin(app);
        return;
    }

    // Read URL params
    const url = new URL(window.location.href);

    // Read page
    router(url);
});

/**
 * Routing
 */

const router = (url) => {

    // Page
    if (url.searchParams.has('page')) {
        const page = url.searchParams.get('page');
        if (page == 'boards')
            renderBoards(app);
        else if (page == 'users')
            renderUsers(app);
    }

    // Board
    else if (url.searchParams.has('board')) {
        renderBoard(app);
    }

    // Fallback
    else {
        renderBoards(app);        
    }

};

window.addEventListener('popstate', (event) => {
    console.log('URL or state has changed:', window.location.href);
});

/**
 * When the app starts, we initialize Juno.
 * @returns {Promise<void>}
 */

const onAppInit = async () => {
    await initSatellite({
        workers: {
            auth: true
        }
    });
};

/**
 * Block defaulot context menu
 */

document.body.addEventListener('contextmenu', event => {
    event.preventDefault();
});

/**
 * Start
 */

document.addEventListener('DOMContentLoaded', onAppInit, {once: true});
