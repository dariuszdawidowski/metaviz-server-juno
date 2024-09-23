
export const renderTopbar = (args) => {

    return `
        <div class="topbar">
            <div>Your resources in ${args.boards} boards and ${args.categories} categories</div>
        </div>
        <div class="topbar" style="background-color: #eee; color: #000;">
            <div><span class="mdi mdi-alert" style="font-size: 1.2em;"></span> This version is for testing and demonstration purposes only. Please do not store any important data here before opening the formal application.</div>
        </div>
    `;
};
