import { signOut } from '@junobuild/core';
import { addEventClick } from '../utils.js';

export const renderLogout = (app) => {

    addEventClick({
        target: app,
        selector: '#logout',
        fn: signOut
    });

    return `
        <div id="logout" class="icon">
            <span class="mdi mdi-logout-variant"></span>
        </div>
    `;

};
