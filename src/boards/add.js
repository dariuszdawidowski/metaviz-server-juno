import { v4 as uuidv4 } from 'uuid';
import { addEvent, cleanString } from '../utils.js';

export const renderAdd = (app, args) => {

    const id = uuidv4();
    let freeze = false;

    // Show input field
    const showInputField = () => {
        document.querySelector(`#add-new-${id}`).style.display = 'none';
        document.querySelector(`#add-input-${id}`).style.display = 'block';
        document.addEventListener('keydown', handleEscapeKey);
        document.body.addEventListener('click', unClick);
    };

    // Hide input field
    const hideInputField = () => {
        document.body.removeEventListener('click', unClick);
        document.removeEventListener('keydown', handleEscapeKey);
        document.querySelector(`#add-input-${id} input`).value = '';
        document.querySelector(`#add-new-${id}`).style.display = 'block';
        document.querySelector(`#add-input-${id}`).style.display = 'none';
    };

    // ESC/Enter keys
    const handleEscapeKey = (event) => {
        if (!freeze) {
            if (event.key === 'Escape') {
                hideInputField();
            }
            else if (event.key === 'Enter') {
                OK();
            }
        }
    };

    // Unclick on body
    const unClick = (event) => {
        let same = false;
        event.composedPath().forEach(element => {
            if (element instanceof HTMLElement && ['board-add'].some(className => element.classList.contains(className))) {
                same = true;
            }
        });
        if (!freeze && !same) hideInputField();
    };

    // Callback
    const OK = () => {
        const value = cleanString(document.querySelector(`#add-input-${id} input`).value.trim());
        if (!freeze && value != '') {
            freeze = true;
            hideInputField();
            args.callback(value).then(() => {
                freeze = false;
            });
        }
    };

    // Add new
    addEvent({
        target: app,
        selector: `#add-new-${id}`,
        type: 'click',
        fn: () => {
            if (!freeze) showInputField();
        }
    });

    // Confirm
    addEvent({
        target: app,
        selector: `#add-input-${id} button`,
        type: 'click',
        fn: () => {
            OK();
        }
    });

    return `
        <div id="add-new-${id}" class="board-add">
            <span class="plus">+</span><span class="add">${args.text}</span>
        </div>
        <div id="add-input-${id}" class="board-add" style="display: none;">
            <input placeholder="${args.placeholder}"><button>OK</button>
        </div>
    `;
};
