
export const renderTopbar = (args) => {

    return `
        <div class="topbar">
            <div>Your resources in ${args.boards} boards and ${args.categories} categories</div>
        </div>
    `;
};
