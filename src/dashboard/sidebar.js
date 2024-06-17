import { renderLogout } from './logout';

export const renderSidebar = (app) => {

    return `
        <div class="sidebar">
            <img src="//cdn1.metaviz.net/metaviz-mark-color-rgba.png" width="50" height="50">
            <div class="icon"><span class="mdi mdi-home-outline"></span></div>
            ${renderLogout(app)}
        </div>
    `;
};
