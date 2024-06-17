import { authSubscribe, initSatellite } from '@junobuild/core';
import { renderBoards } from './dashboard/boards';
import { renderLogin } from './login/login';
import '../../metaviz-editor/style/metaviz.css';
import '../../metaviz-editor/style/popup.css';
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

    renderBoards(app);
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
