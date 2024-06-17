/**
 * Wait for an element to be rendered in the DOM before attaching a passive click event listener to it.
 * @param target The element or parent which its content will be updated / re-rendered.
 * @param selector The selector to the element to which the function should attach the click event.
 * @param fn The function to trigger on click.
 */

export const addEventClick = ({target, selector, fn}) => {
    const observer = new MutationObserver(() => {
        observer.disconnect();
        document.querySelector(selector)?.addEventListener('click', fn, {passive: true});
    });
    observer.observe(target, {childList: true, subtree: true});
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
 * Calculate storage costs
 * @param args.storage: Number - site to calculate in bytes
 * @param args.nodes: int - 13 | 34 nodes sunbet
 */

export const calculateCosts = (args) => {
    const costs = {};

    // Storage
    if ('storage' in args && 'nodes' in args) {

        costs['storage'] = {CYCLES: 0, USD: 0};

        const nodesCost = {13: 127000}
        const cycles1GBperMonth = nodesCost[args.nodes];
        const oneGiB = 1073741824;
        const cycles1BperSecond = cycles1GBperMonth / oneGiB;
        const secondsInMonth = 30 * 24 * 60 * 60;
        costs['storage']['CYCLES'] = args.storage * cycles1BperSecond * secondsInMonth;
        const usdBytesPerMonth = 0.000000000388;
        costs['storage']['USD'] = args.storage * usdBytesPerMonth;

    }

    return costs;
}
