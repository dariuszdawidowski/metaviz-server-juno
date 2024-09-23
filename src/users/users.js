export const renderUsers = (app) => {

    const observer = new MutationObserver(async () => {
        observer.disconnect();
        await updateUsers();
    });
    observer.observe(app, {childList: true, subtree: true});

    app.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: row;">
            <div id="users" class="users">USERS</div>
        </div>
    `;

};

const updateUsers = async () => {

};

window.addEventListener('reload', updateUsers);
