"use strict";

import BCScan from './BCScan.js';

export default class EventHandler {
    constructor() {
        this.handleItemSubmit();
        this.handleItemReScan();
        // this.handleCamera();
    }

    handleItemSubmit() {
        document.getElementById(`itemSubmit`).addEventListener(`click`, () => {
            document.getElementById(`splashDiv`).style.display = `block`;
            document.getElementById(`splashScanDiv`).style.display = `block`;
            document.getElementById(`scannerDiv`).style.display = `none`;
            document.getElementById(`itemEntryDiv`).style.display = `none`;
            document.getElementById(`itemListDiv`).style.display = `none`;
            document.getElementById(`scanResultsExistsDiv`).style.display = `none`;
            document.getElementById(`scanResultsNotExistDiv`).style.display = `none`;
        });
    }

    handleItemReScan() {
        document.getElementById(`reScanBtn`).addEventListener(`click`, () => {
            document.getElementById(`splashDiv`).style.display = `block`;
            document.getElementById(`splashScanDiv`).style.display = `block`;
            document.getElementById(`scannerDiv`).style.display = `none`;
            document.getElementById(`itemEntryDiv`).style.display = `none`;
            document.getElementById(`itemListDiv`).style.display = `none`;
            document.getElementById(`scanResultsExistsDiv`).style.display = `none`;
            document.getElementById(`scanResultsNotExistDiv`).style.display = `none`;
        });
    }

    handleCamera() {
        const player = document.getElementById('player');
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        const captureButton = document.getElementById('capture');

        const constraints = {
            video: true,
        };

        captureButton.addEventListener('click', () => {
            context.drawImage(player, 0, 0, canvas.width, canvas.height);
            // player.srcObject.getVideoTracks().forEach(track => track.stop());
        });
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                player.srcObject = stream;
        });
    }
}