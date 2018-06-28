"use strict";

import BCScan from './BCScan.js';

export default class EventHandler {
    constructor() {
        this.handleTitleCheckBoxes();
        this.handleItemSubmit();
        this.handleItemReScan();
        // this.handleCamera();
    }

    handleTitleCheckBoxes() {
        this.title1 = 0;
        this.title9 = 0;
        this.thirtyOneA = 0;
        let checkBoxes = document.getElementsByName('titleCheckBox');
        for (let i = 0; i < checkBoxes.length; i++) {
            let boxValue = null;
            checkBoxes[i].addEventListener(`click`, () => {
                if (checkBoxes[i].checked) {
                    boxValue = 1;
                } else {
                    boxValue = 0;
                }
                if (checkBoxes[i].id === 'title1') {
                    this.title1 = boxValue;
                } else if (checkBoxes[i].id === 'title9') {
                    this.title9 = boxValue;
                } else {
                    this.thirtyOneA = boxValue;
                }
            });
        }
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
            this.sendFormData();
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

    sendFormData() {
        let formData = new FormData();
        formData.append('tag', document.getElementById('assetTag').value);
        formData.append('maker', document.getElementById('itemMaker').value);
        formData.append('model', document.getElementById('itemModel').value);
        formData.append('sn', document.getElementById('serialNumber').value);
        formData.append('type', document.getElementById('assetType').value);
        formData.append('description', document.getElementById('itemDescription').value);
        formData.append('warranty', document.getElementById('itemWarranty').value);
        formData.append('purchaseDate', document.getElementById('purchaseDate').value);
        formData.append('isTitle1', this.title1);
        formData.append('isTitle9', this.title9);
        formData.append('is31a', this.thirtyOneA);
        fetch(`https://127.0.0.1/`, {
            method: 'POST',
            body: formData,
            headers: {
                'x-requested-with': 'fetch.0',
                'mode': 'no-cors'
            }
        }).then((response) => {
            console.log(response.text());
            return response.json();
        }).catch((err) => {
            // console.log(err);
        });
        document.getElementById('itemEntryForm').reset();
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