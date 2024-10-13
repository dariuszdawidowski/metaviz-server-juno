import { router } from '../main.js';
import { addEvent, setUrlParam, getUrlParam } from '../utils.js';
import { renderLogout } from './logout.js';

export const renderSidebar = (app) => {

    addEvent({
        target: app,
        selector: '#icon-page-boards',
        type: 'click',
        fn: () => {
            setUrlParam('page', 'boards');
            router(app, new URL(window.location.href));
        }
    });

    addEvent({
        target: app,
        selector: '#icon-page-users',
        type: 'click',
        fn: () => {
            setUrlParam('page', 'users');
            router(app, new URL(window.location.href));
        }
    });

    addEvent({
        target: app,
        selector: '#icon-page-groups',
        type: 'click',
        fn: () => {
            setUrlParam('page', 'groups');
            router(app, new URL(window.location.href));
        }
    });

    const observer = new MutationObserver(async () => {
        observer.disconnect();
        await updateSidebar();
    });
    observer.observe(app, {childList: true, subtree: true});

    return `
        <div class="sidebar">
            <a href="https://www.metaviz.net" target="_blank"><img src="//cdn1.metaviz.net/metaviz-mark-color-rgba.png" width="50" height="50"></a>
            <div id="icon-page-boards" class="icon"><span class="mdi mdi-bulletin-board"></span></div>
            <div id="icon-page-users" class="icon"><span class="mdi mdi-account-multiple"></span></div>
            <div id="icon-page-groups" class="icon"><span class="mdi mdi-home-group"></span></div>
            ${renderLogout(app)}
        </div>
    `;
};

const updateSidebar = () => {
    document.querySelectorAll('.sidebar .icon').forEach(element => element.classList.remove('selected'));
    const page = getUrlParam('page') || 'boards';
    document.querySelector(`#icon-page-${page}`)?.classList.add('selected');

};
