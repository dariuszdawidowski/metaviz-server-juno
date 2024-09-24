/**
 * Wait for an element to be rendered in the DOM before attaching a passive click event listener to it.
 * @param target The element or parent which its content will be updated / re-rendered.
 * @param selector The selector to the elements to which the function should attach the click event.
 * @param type Event name
 * @param fn The function to trigger.
 */

export const addEvent = ({target, selector, type, fn}) => {
    const observer = new MutationObserver(() => {
        observer.disconnect();
        document.querySelectorAll(selector).forEach(element => {
            element.addEventListener(type, fn, {passive: true});
        });
    });
    observer.observe(target, {childList: true, subtree: true});
};

/**
 * URL params
 */

export const setUrlParam = (param, value) => {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.replaceState({}, '', url);
};

export const getUrlParam = (param) => {
    const url = new URL(window.location);
    return url.searchParams.get(param);
};

/**
 * Reload
 */

export const reload = () => {
    const event = new Event('reload');
    window.dispatchEvent(event);
};

/**
 * Remove from string all unusual characters
 * @param input: string
 */

export const cleanString = (input) => {
    const regex = /[^\p{L}\p{N}\s_-]/gu;
    return input.replace(regex, '');
};

/**
 * Fill with zeros
 * @param num: Number
 */

export const padToTwoDigits = (num) => {
    return num.toString().padStart(2, '0');
};

/**
 * Format Number of bytes to human-readable string
 * @param num: Number
 */

export const bytes2Human = (num) => {
    // Petabytes
    if (num > (1024 ** 5)) return '' + (num / (1024 ** 5)).toFixed(2) + ' PB';
    // Terabytes
    if (num > (1024 ** 4)) return '' + (num / (1024 ** 4)).toFixed(2) + ' TB';
    // Gigabytes
    if (num > (1024 ** 3)) return '' + (num / (1024 ** 3)).toFixed(2) + ' GB';
    // Megabytes
    if (num > (1024 ** 2)) return '' + (num / (1024 ** 2)).toFixed(2) + ' MB';
    // Kilobytes
    if (num > 1024) return '' + Math.round(num / 1024) + ' KB';
    // Bytes
    return '' + num + ' B';
};

/**
 * Format Number of cycles to human-readable string
 * @param num: Number
 */

export const formatCycles = (num) => {
    const suffixes = ['C', 'KC', 'MC', 'BC', 'TC'];
    let suffixIndex = 0;
    while (Math.abs(num) >= 1000 && suffixIndex < suffixes.length - 1) {
        num /= 1000;
        suffixIndex++;
    }
    return num.toFixed() + suffixes[suffixIndex];
};

/**
 * Busy spinner
 */

export const showSpinner = () => {
    document.getElementById('metaviz-spinner').style.display = 'block';
};

export const hideSpinner = () => {
    document.getElementById('metaviz-spinner').style.display = 'none';
};
