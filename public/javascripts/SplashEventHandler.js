"use strict";

import BCScan from './BCScan.js';

export default class SplashEventHandler {
    constructor() {
        this.handleItemEntryBtn();
        this.handleSplashScanBtn();
    }

    handleItemEntryBtn() {
        let itemEntryButtons = document.getElementsByName("itemEntryBtn");
        for (let i = 0; i < itemEntryButtons.length; i++) {
            itemEntryButtons[i].addEventListener(`click`, () => {
                document.getElementById(`splashDiv`).style.display = `none`;
                document.getElementById(`scanResultsExistsDiv`).style.display = `none`;
                document.getElementById(`scanResultsNotExistDiv`).style.display = `none`;
                document.getElementById(`itemEntryDiv`).style.display = `block`;
            });
        }
    }

    handleSplashScanBtn() {
        document.getElementById(`splashScanBtn`).addEventListener(`click`, () => {
            new BCScan();
            document.getElementById(`splashScanDiv`).style.display = `none`;
            document.getElementById(`scanner-container`).style.display = `block`;
        });
    }
}