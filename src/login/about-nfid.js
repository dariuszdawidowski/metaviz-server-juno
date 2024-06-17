const aboutNFIDCreate = () => {

    const content = `
        <div class="wizard">
            <div class="step">
                <div class="nr">1</div>
                <div class="title">What is NFID?</div>
                <div class="image">
                    <img src="https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/d2ca8008-36ad-4960-8ba6-966542a38cc8/ID_400x400/w=640,quality=80,fit=scale-down" width="22" style="margin-left: 10px; margin-right: 17px;">
                </div>
                <div class="desc">
                    A single global user account that grant access to services on the internet without the need to use traditional authentication methods such as passwords.
                </div>
            </div>
            <span class="arrow mdi mdi-arrow-right-bold-circle-outline"></span>
            <div class="step">
                <div class="nr">2</div>
                <div class="title">Requirements</div>
                <div class="desc">
                    Simply you can use your email or more advanced solution with hardware biometrics or dongle.
                </div>
            </div>
            <span class="arrow mdi mdi-arrow-right-bold-circle-outline"></span>
            <div class="step">
                <div class="nr">3</div>
                <div class="title">Register</div>
                <div class="desc">
                    1. Go to <a href="https://nfid.one/" target="_blank">nfid.one <span class="mdi mdi-open-in-new"></span></a> page.<br>
                    2. Press "Sign in using email".<br>
                    3. Check your email and click on "Verify email" button.<br>
                    4. On the first page you will be logged in into your Profile.<br>
                </div>
            </div>
            <span class="arrow mdi mdi-arrow-right-bold-circle-outline"></span>
            <div class="step">
                <div class="nr">4</div>
                <div class="title">Follow up</div>
                <div class="desc">
                    On your profile page go to "Security" -> Two-factor authentication to add hardware passkey for better security.<br>
                    <br>
                    Read more about NFID <a href="https://learn.nfid.one/" target="_blank">here <span class="mdi mdi-open-in-new"></span></a>.
                </div>
            </div>
        </div>
    `;

    return `
        <div class="border top-left resize"></div>
        <div class="border top resize"></div>
        <div class="border top-right resize"></div>
        <div class="border left resize"></div>
        <div class="middle" style="display: flex; flex-direction: column; width: 632px; height: 318px;">
            <div class="titlebar" style="display: flex; flex-direction: row-reverse;">
                <div class="close window-button">×</div>
            </div>
            <div class="content">
               ${content}
            </div>
        </div>
        <div class="border right resize"></div>
        <div class="border bottom-left resize"></div>
        <div class="border bottom resize"></div>
        <div class="border bottom-right resize"></div>
    `;

};


export const aboutNFID = () => {

    // Pseudo popup
    let popup = document.getElementById('wizard-nfid');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'wizard-ndif';
        popup.classList.add('total-popup-window');
        popup.innerHTML = aboutNFIDCreate();
        document.getElementById('app').append(popup);
        popup.querySelector('.window-button.close').onclick = () => popup.style.display = 'none';
        const content = popup.querySelector('.total-popup-window .content');
        popup.querySelectorAll('.arrow').forEach(arrow => {
            arrow.onclick = () => content.scrollTo({left: content.scrollLeft + 200, behavior: 'smooth'});
        });
    }
    popup.style.display = 'block';
};
