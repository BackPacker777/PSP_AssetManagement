"use strict";

import BCScan from './BCScan.js';

export default class EventHandler {
    constructor() {
        this.handleTitleCheckBoxes();
        this.handleItemSubmit();
        this.handleItemReScan();
        this.handleItemFind();
        this.handleItemList();
        this.handleDone();
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
            EventHandler.setDivDisplay(`splashDiv`, `splashScanDiv`);
            this.sendFormData();
        });
    }

    handleItemReScan() {
        document.getElementById(`reScanBtn`).addEventListener(`click`, () => {
            EventHandler.setDivDisplay(`splashDiv`, `splashScanDiv`);
        });
    }

    handleDone() {
        document.getElementById(`doneBtn`).addEventListener(`click`, () => {
            EventHandler.setDivDisplay(`splashDiv`, `splashScanDiv`);
        });
    }

    handleItemFind() {
        document.getElementById(`itemFindBtn`).addEventListener(`click`, () => {
            EventHandler.setDivDisplay(`itemFindDiv`);
        });
    }

    handleItemList() {
        document.getElementById(`itemListBtn`).addEventListener(`click`, () => {
            EventHandler.setDivDisplay(`itemListDiv`, `doneDiv`);
            fetch(document.url, {
                method: 'POST',
                headers: {
                    'x-requested-with': 'fetch.1',
                    'mode': 'no-cors'
                }
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < 11; j++) {
                        document.getElementById('listedItems').innerText += ` ${data[i][j]}`;
                    }
                    document.getElementById('listedItems').innerText += `\n\n`;
                }
            }).catch(function (error) {
                console.log(error);
            });
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
        fetch(`https://localhost`, {
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

    static setDivDisplay(div1, div2) {
        const DIVS = [`splashDiv`, `splashScanDiv`, `scannerDiv`, `itemEntryDiv`, `itemListDiv`, `scanResultsExistsDiv`, `scanResultsNotExistDiv`, `itemFindDiv`, `doneDiv`];
        for (let index in DIVS) {
            if (div1 === DIVS[index] || div2 === DIVS[index]) {
                document.getElementById(DIVS[index]).style.display = `block`;
            } else {
                document.getElementById(DIVS[index]).style.display = `none`;
            }
        }
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