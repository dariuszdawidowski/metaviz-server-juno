import { renderLogout } from './logout.js';

export const renderSidebar = (app) => {

    return `
        <div class="sidebar">
            <a href="https://www.metaviz.net" target="_blank"><img src="//cdn1.metaviz.net/metaviz-mark-color-rgba.png" width="50" height="50"></a>
            <div class="icon"><span class="mdi mdi-bulletin-board"></span></div>
            <div class="icon"><span class="mdi mdi-account-multiple"></span></div>
            ${renderLogout(app)}
        </div>
    `;
};
