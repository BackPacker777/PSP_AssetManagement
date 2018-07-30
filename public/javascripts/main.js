"use strict";

import EventHandler from './EventHandler.js';
import SplashEventHandler from "./SplashEventHandler.js";

class Main {
    constructor() {
        new EventHandler();
        new SplashEventHandler();
        this.prepUX();
        Main.loadServiceWorker();
        Main.handleManifest();
    }

    prepUX() {
        document.getElementById(`splashDiv`).style.display = `block`;
        document.getElementById(`scannerDiv`).style.display = `none`;
        document.getElementById(`itemEntryDiv`).style.display = `none`;
        document.getElementById(`itemListDiv`).style.display = `none`;
        document.getElementById(`scanResultsExistsDiv`).style.display = `none`;
        document.getElementById(`scanResultsNotExistDiv`).style.display = `none`;
        document.getElementById(`itemFindDiv`).style.display = `none`;
        document.getElementById(`doneDiv`).style.display = `none`;
        document.getElementById(`itemDeleteDiv`).style.display = `none`;
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
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log(`Installation Banner Triggered!`)
            e.preventDefault();
            deferredPrompt = e;
            btnAdd.style.display = 'block';
            btnAdd.addEventListener('click', (e) => {
                btnAdd.style.display = 'none';
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