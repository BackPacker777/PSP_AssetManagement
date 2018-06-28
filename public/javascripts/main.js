"use strict";

import EventHandler from './EventHandler.js';
import SplashEventHandler from "./SplashEventHandler.js";

class Main {
    constructor() {
        this.date = new Date();
        new EventHandler();
        new SplashEventHandler();
        // document.getElementById("weekDay").innerText = `${this.date.getMonth() + 1}/${this.date.getDate()}/${this.date.getFullYear()}`;
        this.prepUX();
        Main.loadServiceWorker();
        Main.handleManifest();
    }

    prepUX() {
        // document.getElementById(`camera`).style.display = `none`;
        document.getElementById(`splashDiv`).style.display = `block`;
        document.getElementById(`scannerDiv`).style.display = `none`;
        document.getElementById(`itemEntryDiv`).style.display = `none`;
        document.getElementById(`itemListDiv`).style.display = `none`;
        document.getElementById(`scanResultsExistsDiv`).style.display = `none`;
        document.getElementById(`scanResultsNotExistDiv`).style.display = `none`;
    }

    static loadServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/ServiceWorker.js');
        }
    }

    static handleManifest() {
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            btnAdd.style.display = 'block';
        });
    }

    /*static async populateZips() {
        const response = await fetch(`/data/ZipCodeDB.csv`, {
            method: 'post',
            headers: {'x-requested-with': 'fetch.0'}
        });
        return await response.text();
    }*/
}

window.addEventListener('load', () => {
    new Main();
    /*Main.populateZips().then((zips) => {
        zips = JSON.parse(zips);
        new Main(zips);
    });*/
});