const aboutInternetIdentityCreate = () => {

    const content = `
        <div class="wizard">
            <div class="step">
                <div class="nr">1</div>
                <div class="title">What is Internet Identity?</div>
                <div class="image">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 233 111" style="width: 40px; margin-right: 10px">
                        <defs>
                          <linearGradient id="grad-o-y" x1="145.304" x2="221.385" y1="7.174" y2="85.958" gradientUnits="userSpaceOnUse">
                            <stop offset=".21" stop-color="#F15A24"></stop>
                            <stop offset=".684" stop-color="#FBB03B"></stop>
                          </linearGradient>
                          <linearGradient id="grad-p-p" x1="85.087" x2="9.006" y1="101.622" y2="22.838" gradientUnits="userSpaceOnUse">
                            <stop offset=".21" stop-color="#ED1E79"></stop>
                            <stop offset=".893" stop-color="#522785"></stop>
                          </linearGradient>
                        </defs>
                        <g transform="translate(0 2)">
                          <path fill="url(#grad-o-y)" d="M174.433 0c-12.879 0-26.919 6.6-41.758 19.6-7.04 6.159-13.12 12.759-17.679 18.038l.04.04v-.04s7.199 7.84 15.159 16.24c4.28-5.08 10.44-12 17.519-18.24 13.2-11.559 21.799-13.999 26.719-13.999 18.52 0 33.559 14.68 33.559 32.719 0 17.92-15.079 32.599-33.559 32.719-.84 0-1.92-.12-3.28-.4 5.4 2.32 11.2 4 16.72 4 33.918 0 40.558-22.12 40.998-23.72 1-4.04 1.52-8.28 1.52-12.64C230.391 24.4 205.272 0 174.433 0Z"></path>
                          <path fill="url(#grad-p-p)" d="M55.958 108.796c12.88 0 26.919-6.6 41.758-19.6 7.04-6.16 13.12-12.759 17.679-18.039l-.04-.04v.04s-7.199-7.84-15.159-16.24c-4.28 5.08-10.44 12-17.52 18.24-13.199 11.56-21.798 14-26.718 14-18.52-.04-33.559-14.72-33.559-32.76C22.4 36.48 37.48 21.8 55.958 21.68c.84 0 1.92.12 3.28.4-5.4-2.32-11.2-4-16.72-4C8.6 18.08 2 40.2 1.52 41.76A52.8 52.8 0 0 0 0 54.397c0 29.999 25.119 54.398 55.958 54.398Z"></path>
                          <path fill="#29ABE2" d="M187.793 90.197c-17.36-.44-35.399-14.12-39.079-17.52-9.519-8.8-31.479-32.599-33.198-34.479C99.436 20.16 77.637 0 55.958 0h-.08C29.558.12 7.44 17.96 1.52 41.758c.44-1.56 9.12-24.119 40.958-23.319 17.36.44 35.479 14.32 39.199 17.72 9.52 8.8 31.479 32.598 33.199 34.478 16.079 18 37.878 38.159 59.557 38.159h.08c26.319-.12 48.478-17.96 54.358-41.759-.48 1.56-9.2 23.92-41.078 23.16Z"></path>
                        <g>
                        </g></g>
                    </svg>
                </div>
                <div class="desc">
                    A single global user account that grant access to services on the IC blockchain without the need to use traditional authentication methods such as passwords.
                </div>
            </div>
            <span class="arrow mdi mdi-arrow-right-bold-circle-outline"></span>
            <div class="step">
                <div class="nr">2</div>
                <div class="title">Requirements</div>
                <div class="desc">
                    A device with support for biometric (e.g. fingerprint readers or facial recognition) or dongles (e.g. YubiKey) is required.<br>
                    <br>
                    There is also a fallback option by creating a temporary key from a PIN.
                </div>
            </div>
            <span class="arrow mdi mdi-arrow-right-bold-circle-outline"></span>
            <div class="step">
                <div class="nr">3</div>
                <div class="title">Register</div>
                <div class="desc">
                    1. Go to <a href="https://identity.ic0.app" target="_blank">identity.ic0.app <span class="mdi mdi-open-in-new"></span></a> page.<br>
                    2. Press "Create Internet Identity".<br>
                    3. Press "Create Passkey".<br>
                </div>
            </div>
            <span class="arrow mdi mdi-arrow-right-bold-circle-outline"></span>
            <div class="step">
                <div class="nr">4</div>
                <div class="title">Follow up</div>
                <div class="desc">
                    We highly encourage you to create a recovery phrase, keep it in a safe place, and use it to clone your Internet Identity on your other devices.<br>
                    <br>
                    Read more about Internet Identity <a href="https://internetcomputer.org/internet-identity" target="_blank">here <span class="mdi mdi-open-in-new"></span></a>.
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

export const aboutInternetIdentity = () => {

    // Pseudo popup
    let popup = document.getElementById('wizard-ii');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'wizard-ii';
        popup.classList.add('total-popup-window');
        popup.innerHTML = aboutInternetIdentityCreate();
        document.getElementById('app').append(popup);
        popup.querySelector('.window-button.close').onclick = () => popup.style.display = 'none';
        const content = popup.querySelector('.total-popup-window .content');
        popup.querySelectorAll('.arrow').forEach(arrow => {
            arrow.onclick = () => content.scrollTo({left: content.scrollLeft + 200, behavior: 'smooth'});
        });
    }
    popup.style.display = 'block';
};
