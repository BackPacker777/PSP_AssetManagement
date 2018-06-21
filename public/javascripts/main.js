"use strict";

import EventHandler from './EventHandler.js';
import SplashEventHandler from "./SplashEventHandler.js";

class Main {
    constructor(zips) {
        this.date = new Date();
        this.eventHandler = new EventHandler();
        this.splashEvenetHandler = new SplashEventHandler();
        // document.getElementById("weekDay").innerText = `${this.date.getMonth() + 1}/${this.date.getDate()}/${this.date.getFullYear()}`;
        this.prepUX();
    }

    prepUX() {
        // this.eventHandler.displayVariable();
        // document.getElementById(`camera`).style.display = `none`;
        document.getElementById(`splashDiv`).style.display = `block`;
        document.getElementById(`scannerDiv`).style.display = `none`;
        document.getElementById(`itemEntryDiv`).style.display = `none`;
        document.getElementById(`itemListDiv`).style.display = `none`;
        document.getElementById(`scanResultsExistsDiv`).style.display = `none`;
        document.getElementById(`scanResultsNotExistDiv`).style.display = `none`;
    }

    static async populateZips() {
        const response = await fetch(`/data/ZipCodeDB.csv`, {
            method: 'post',
            headers: {'x-requested-with': 'fetch.0'}
        });
        return await response.text();
    }
}

window.addEventListener('load', () => {
    Main.populateZips().then((zips) => {
        zips = JSON.parse(zips);
        new Main(zips);
    });
});