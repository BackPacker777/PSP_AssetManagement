"use strict";

import EventHandler from './EventHandler.js';
import SplashEventHandler from "./SplashEventHandler.js";

class Main {
    constructor() {
        new EventHandler();
        new SplashEventHandler();
        Main.prepUX();
        Main.loadServiceWorker();
        Main.handleManifest();
    }

    static prepUX() {
        document.getElementById(`splashDiv`).style.display = `block`;
        document.getElementById(`scanner-container`).style.display = `none`;
        document.getElementById(`assetEntryDiv`).style.display = `none`;
        document.getElementById(`assetListDiv`).style.display = `none`;
        document.getElementById(`scanResultsExistsDiv`).style.display = `none`;
        document.getElementById(`scanResultsNotExistDiv`).style.display = `none`;
        document.getElementById(`assetFindDiv`).style.display = `none`;
        document.getElementById(`doneDiv`).style.display = `none`;
        document.getElementById(`assetDeleteDiv`).style.display = `none`;
        document.getElementById(`installBanner`).style.display = 'none';

        document.getElementById(`assetMaker`).disabled = true;
        document.getElementById(`assetType`).disabled = true;
        document.getElementById(`serialNumber`).disabled = true;
        document.getElementById(`assetModel`).disabled = true;
        document.getElementById(`assetDescription`).disabled = true;
        document.getElementById(`assetLocation`).disabled = true;
        document.getElementById(`purchaseDate`).disabled = true;
        document.getElementById(`assetWarranty`).disabled = true;
        document.getElementById(`title1`).disabled = true;
        document.getElementById(`title9`).disabled = true;
        document.getElementById(`31a`).disabled = true;
        document.getElementById(`assetSubmit`).disabled = true;
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