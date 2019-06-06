"use strict";

import EventHandler from './EventHandler.js';

/**
 * @desc Dispatcher class
 */
class Main {
    /**
     * @desc instantiates anonymous EventHandler
     */
    constructor() {
        new EventHandler();
        Main.prepUX();
        Main.loadServiceWorker();
        // Main.handleManifest();
    }

    /**
     * @desc Loads user experience (UX) in the DOM
     */
    static prepUX() {
        EventHandler.setDivDisplay([`splashDiv`,`splashScanDiv`]);
        EventHandler.enableDisableInputs([`assetEntryBtn`,`assetFindBtn`,`assetListBtn`,`splashScanBtn`]);
    }

    /**
     * @desc Loads PWA service worker (ServiceWorker.js)
     */
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

    /**
     * @desc loads PWA web manifest file (manifest.json)
     */
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

/**
 * @desc Program bootstrapper
 */
window.addEventListener('load', () => {
    new Main();
});