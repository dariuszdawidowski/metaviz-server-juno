/* Consumption and Expenses panel */

import { jsonReplacer, jsonReviver } from '@junobuild/utils';
import { padToTwoDigits, bytes2Human, formatCycles } from '../utils.js';
import packageJson from '../../package.json' assert { type: 'json' };

/**
 * Calculate size of categories, boards, code and media files
 * @param args.categories: list of Docs - listed categories
 * @param args.boards: list of Docs - listed boards
 */

const calculateSize = (args) => {

    const categoriesSize = args.categories.items.reduce((acc, item) => {
        const blob = new Blob([JSON.stringify(item.data, jsonReplacer)], { type: 'application/json; charset=utf-8' });
        return acc + blob.size;
    }, 0);

    const boardsSize = args.boards.items.reduce((acc, item) => {
        const blob = new Blob([JSON.stringify(item.data, jsonReplacer)], { type: 'application/json; charset=utf-8' });
        return acc + blob.size;
    }, 0);

    const filesSize = args.files.assets.reduce((acc, file) => {
        return acc + Number(file.encodings.identity.total_length);
    }, 0);

    const codeSize = 52428800;

    return {
        categories: categoriesSize,
        boards: boardsSize,
        files: filesSize,
        filesCount: args.files.assets.length,
        code: codeSize,
        total: categoriesSize + boardsSize + filesSize + codeSize
    };
};

/**
 * Calculate storage costs
 * @param args.storage: Number - site to calculate in bytes
 * @param args.nodes: int - 13 | 34 nodes sunbet
 */

const calculateCosts = (args) => {
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

/**
 * Render info panel "Consumption and Expenses"
 */

export const renderPanelExpenses = (app) => {

    return `
        <div class="infobar">
            <div class="tablet square">
                <h1>Consumption and Expenses</h1>
                <h2><span id="storage-expenses-usd"></span> / month</h2>
                <div>Storage</div>
                <div id="storage-expenses"></div>
            </div>
            <div class="tablet">
                <div style="text-align: center;">Metaviz v0.9.19 @ IC backend v${packageJson.version}</div>
                <div class="powered-by-icp">
                    Powered by<br>
                    <a href="https://internetcomputer.org" target="_blank">
                        <img src="/media/internet-computer-icp-logo.svg" style="width: 18px; margin-right: 1px;"> Internet Computer
                    </a>
                </div>
            </div>
        </div>
    `;

};

/**
 * Update
 * @param args.categories: list of Docs - listed categories
 * @param args.boards: list of Docs - listed boards
 * @param args.files: list of Docs - listed files
 */

export const updatePanelExpenses = (args) => {

    // Calculate
    const size = calculateSize(args);

    // Data storage cost
    const price = calculateCosts({storage: size.total, currency: 'C', nodes: 13})
    document.querySelector('#storage-expenses').innerHTML = `total of ${bytes2Human(size.total)} | monthly ${formatCycles(price.storage.CYCLES)}<br>including ${bytes2Human(size.files)} in ${size.filesCount} media+files`;
    document.querySelector('#storage-expenses-usd').innerHTML = `$${Math.max(price.storage.USD, 0.01).toFixed(2)}`;

    // Data storage usage
    /*
    const ctx = document.getElementById('canister-storage-usage').getContext('2d');
    const tokenomicsChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Code', 'Data (stable)', 'Files (stable)', 'Heap'],
            datasets: [{
                data: [150000, 400000, 100000, 200000],
                backgroundColor: ['#f3c300', '#fe8c00', '#b93e8c', '#60388b'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.raw;
                            return label + ' MB';
                        }
                    }
                }
            }
        }
    });
    */

};
