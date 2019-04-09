"use strict";

import BCScan from './BCScan.js';

export default class SplashEventHandler {
    constructor() {
        this.handleassetEntryBtn();
        this.handleSplashScanBtn();
    }

    handleassetEntryBtn() {
        let assetEntryButtons = document.getElementsByName("assetEntryBtn");
        for (let i = 0; i < assetEntryButtons.length; i++) {
            assetEntryButtons[i].addEventListener(`click`, () => {
                document.getElementById(`splashDiv`).style.display = `none`;
                document.getElementById(`scanResultsExistsDiv`).style.display = `none`;
                document.getElementById(`scanResultsNotExistDiv`).style.display = `none`;
                document.getElementById(`entryResult`).style.display = `none`;
                document.getElementById(`assetEntryDiv`).style.display = `block`;
                document.getElementById(`doneDiv`).style.display = `block`;
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