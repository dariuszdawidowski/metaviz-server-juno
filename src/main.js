import { authSubscribe, initSatellite } from '@junobuild/core';
import { renderBoard } from './board/render.js';
import { Boards } from './boards/boards.js';
import { Users } from './users/users.js';
import { Groups } from './groups/groups.js';
import { renderLogin } from './login/login.js';
import '../style.css';

/**
 * Global listener. When the user sign-in or sign-out, we re-render the app.
 */

authSubscribe((user) => {

    // Main container
    const app = document.querySelector('#app');

    // Login
    if (user === null || user === undefined) {
        renderLogin(app);
    }

    // Show page
    else {
        router(app, new URL(window.location.href));
    }

});

/**
 * Create components
 */

const boards = new Boards(app);
const users = new Users(app);
const groups = new Groups(app);

/**
 * Routing
 */

export const router = (app, url) => {

    // Page
    if (url.searchParams.has('page')) {

        // Read /?page=<name>
        const page = url.searchParams.get('page');

        // Page: boards
        if (page == 'boards') {
            boards.render();
        }

        // Page: users
        else if (page == 'users') {
            users.render();
        }

        // Page: groups
        else if (page == 'groups') {
            groups.render();
        }
    }

    // Board
    else if (url.searchParams.has('board')) {
        renderBoard(app);
    }

    // Fallback
    else {
        boards.render();
    }

};

/**
 * Block default context menu
 */

document.body.addEventListener('contextmenu', event => {
    event.preventDefault();
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
 * Start
 */

document.addEventListener('DOMContentLoaded', onAppInit, {once: true});
