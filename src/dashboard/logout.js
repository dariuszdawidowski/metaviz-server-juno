import { signOut } from '@junobuild/core';
import { addEvent } from '../utils.js';

export const renderLogout = (app) => {

    addEvent({
        target: app,
        selector: '#logout',
        type: 'click',
        fn: signOut
    });

    return `
        <div id="logout" class="icon">
            <span class="mdi mdi-logout-variant"></span>
        </div>
    `;

};
