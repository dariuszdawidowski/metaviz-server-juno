import { authSubscribe, initSatellite } from '@junobuild/core';
import { renderBoard } from './board/render.js';
import { renderDashboard } from './dashboard/boards.js';
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
    const params = new URLSearchParams(url.search);

    if (params.has('board')) {
        renderBoard(app);
    }
    else {
        renderDashboard(app);
    }
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

document.addEventListener('DOMContentLoaded', onAppInit, {once: true});
