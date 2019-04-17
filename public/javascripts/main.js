"use strict";

import EventHandler from './EventHandler.js';

class Main {
    constructor() {
        new EventHandler();
        Main.prepUX();
        // Main.loadServiceWorker();
        // Main.handleManifest();
    }

    static prepUX() {
        EventHandler.setDivDisplay([`splashDiv`,`splashScanDiv`]);
        EventHandler.enableDisableInputs([`assetEntryBtn`,`assetFindBtn`,`assetListBtn`,`installBtn`,`splashScanBtn`]);
    }

    static loadServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/ServiceWorker.js')
                .then((reg) => {
                    console.log('BDH ServiceWorker registration succeeded. Scope is ' + reg.scope);
                }).catch((error) => {
                    console.log('Registration failed with ' + error);
            });
        }
    }

    static handleManifest() {
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (event) => {
            console.log(`Installation Banner Triggered!`);
            event.preventDefault();
            deferredPrompt = event;
            document.getElementById(`installBanner`).style.display = 'block';
            document.getElementById(`installButton`).addEventListener('click', (event) => {
                document.getElementById(`installBanner`).style.display = 'none';
                deferredPrompt.prompt();
                deferredPrompt.userChoice
                    .then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('User accepted the A2HS prompt');
                        } else {
                            console.log('User dismissed the A2HS prompt');
                        }
                        deferredPrompt = null;
                    });
            });
        });
    }
}

window.addEventListener('load', () => {
    new Main();
});