"use strict";

import Fader from './FadeStuff.js';

export default class EventHandler {
    constructor() {
        this.fader = new Fader();
        this.handleAssetTag();
        this.handleAssetMaker();
        this.handleTitleCheckBoxes();
        this.handleAssetSubmit();
        this.handleAssetReScan();
        this.handleAssetFind();
        this.handleAssetList();
        this.handleDone();
        this.handleForward();
        this.handleBackward();
    }

    populateAssetData(whichData, callback) {
        fetch(document.url, {
            method: 'POST',
            body: null,
            headers: {
                'x-requested-with': `fetch.${whichData}`,
                'mode': 'no-cors'
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            callback(data);
        }).catch((error) => {
            console.log(error);
        });
    }

    handleAssetTag() {
        const MAX_TAG = 99999999;
        document.getElementById(`assetTag`).addEventListener(`blur`, () => {
            let tagValue = Number(document.getElementById(`assetTag`).value);
            if (tagValue > 0 && tagValue < MAX_TAG) {
                document.getElementById(`assetMaker`).disabled = false;
            } else {
                alert(`Invalid number, please re-enter.`);
                document.getElementById(`assetMaker`).disabled = true;
                document.getElementById(`assetTag`).value = "";
            }
        });
    }

    handleAssetMaker() {
        this.populateAssetData(4, (assetData) => {
            for (let i = 0; i < assetData.length; i++) {
                let option = document.createElement("option");
                option.text = assetData[i][0];
                option.value = assetData[i][0];
                document.getElementById("assetMaker").appendChild(option);
            }
            document.getElementById(`assetMaker`).addEventListener(`change`, () => {
                document.getElementById(`assetType`).disabled = false;
                this.handleAssetType(assetData);
            });
        });
    }

    handleAssetType(assetData) {
        let assetVendor = document.getElementById('assetMaker');
        let assetVendorValue = assetVendor.options[assetVendor.selectedIndex].value;
        for (let i = 0; i < assetData.length; i++) {
            if (assetData[i][0] === assetVendorValue) {
                for (let j = 1; j < assetData[i].length; j++) {
                    let option = document.createElement("option");
                    option.text = assetData[i][j];
                    option.value = assetData[i][j];
                    document.getElementById("assetType").appendChild(option);
                }
                break;
            }
        }
        document.getElementById(`assetType`).addEventListener(`change`, () => {
            document.getElementById(`serialNumber`).disabled = false;
            document.getElementById(`assetModel`).disabled = false;
            this.handleAssetModel();
        });
    }

    handleAssetModel() {
        this.populateAssetData(5, (assetData) => {
            let assetType = document.getElementById('assetType');
            let assetTypeValue = assetType.options[assetType.selectedIndex].value;
            for (let i = 0; i < assetData.length; i++) {
                if (assetData[i][0] === assetTypeValue) {
                    for (let j = 1; j < assetData[i].length; j++) {
                        let option = document.createElement("option");
                        option.text = assetData[i][j];
                        option.value = assetData[i][j];
                        document.getElementById("assetModel").appendChild(option);
                    }
                    break;
                }
            }
            document.getElementById(`assetDescription`).disabled = false;
            document.getElementById(`assetLocation`).disabled = false;
            document.getElementById(`purchaseDate`).disabled = false;
            document.getElementById(`assetWarranty`).disabled = false;
            document.getElementById(`title1`).disabled = false;
            document.getElementById(`title9`).disabled = false;
            document.getElementById(`31a`).disabled = false;
            document.getElementById(`assetSubmit`).disabled = false;
        });
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

    handleAssetSubmit() {
        document.getElementById(`assetSubmit`).addEventListener(`click`, () => {
            if (document.forms['assetEntryForm'].checkValidity()) {
                this.sendFormData();
                document.getElementById('happyFace').style.display = 'none';
                this.fader.doFade('in', 'entryResult');
                setTimeout(() => {
                    document.getElementById('entryResult').style.display = 'none';
                    this.fader.doFade('in', 'happyFace');
                }, 2000);
            } else {
                document.forms['assetEntryForm'].reportValidity();
            }
        });
    }

    handleAssetReScan() {
        document.getElementById(`reScanBtn`).addEventListener(`click`, () => {
            EventHandler.setDivDisplay([`splashDiv`, `splashScanDiv`]);
        });
    }

    handleDone() {
        document.getElementById(`doneBtn`).addEventListener(`click`, () => {
            document.getElementById('listedAssets').innerHTML = ``;
            document.getElementById(`assetEntryForm`).reset();
            document.getElementById(`assetFindForm`).reset();
            EventHandler.setDivDisplay([`splashDiv`, `splashScanDiv`]);
        });
    }

    handleAssetFind() {
        document.getElementById(`assetFindBtn`).addEventListener(`click`, () => {
            EventHandler.setDivDisplay([`assetFindDiv`]);
            this.handleAssetFindSubmit();
        });
    }

    handleAssetList() {
        let self = this;
        document.getElementById(`assetListBtn`).addEventListener(`click`, () => {
            EventHandler.setDivDisplay([`assetListDiv`, `doneDiv`, `assetEditDiv`]);
            this.handleAssetEdit();
            fetch(document.url, {
                method: 'POST',
                headers: {
                    'x-requested-with': 'fetch.1',
                    'mode': 'no-cors'
                }
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                self.listAssets(data);
            }).catch(function (error) {
                console.log(error);
            });
        });
    }

    listAssets(data) {
        if (data.length > 0) {
            let self = this;
            const MD_COLUMNS = 4;
            let assetDeleteList = [];
            for (let i = 0; i < data.length; i++) {
                let newRow = document.createElement('div');
                newRow.setAttribute('class', 'grid-x grid-padding-x grid-padding-y');
                let newCell1 = document.createElement('div');
                newCell1.setAttribute('class', 'cell small-1 large-1');
                let newCell2 = document.createElement('div');
                newCell2.setAttribute('class', 'cell small-11 large-11');
                newCell2.setAttribute('id', `listAsset${i}`);
                let newAssetCheck = document.createElement('input');
                newAssetCheck.setAttribute('type', 'checkbox');
                newAssetCheck.setAttribute('id', `assetCheck${i}`);
                newAssetCheck.setAttribute('name', 'assetCheck');
                newCell1.appendChild(newAssetCheck);
                document.getElementById('listedAssets').appendChild(newRow);
                newRow.appendChild(newCell1);
                newAssetCheck.addEventListener('click', () => {
                    let tempArray = [];
                    let assetChecks = document.forms['listedAssets'].elements['assetCheck'];
                    const TAG_COLUMN = 2;
                    for (let i = 0; i < assetChecks.length; i++) {
                        if (assetChecks[i].checked) {
                            tempArray.push(data[i][TAG_COLUMN]);
                        }
                    }
                    assetDeleteList.length = 0;
                    assetDeleteList = tempArray.slice(0); // https://davidwalsh.name/javascript-clone-array
                    tempArray.length = 0;
                    if (assetDeleteList.length > 0) {
                        // console.log(assetDeleteList);
                        self.handleAssetDelete(assetDeleteList);
                        EventHandler.setDivDisplay([`assetListDiv`, `doneDiv`, `assetDeleteDiv`]);
                    } else {
                        EventHandler.setDivDisplay([`assetListDiv`, `doneDiv`]);
                    }
                });
                newRow.appendChild(newCell2);
                for (let j = 0; j < MD_COLUMNS; j++) {
                    document.getElementById(`listAsset${i}`).innerText += ` ${data[i][j]}`;
                }
            }
        } else {
            document.getElementById('listedAssets').innerHTML = `<br><br><h1>Asset does not exist in inventory.</h1>`;
        }
    }

    handleAssetEdit(assetEditList) {
        document.getElementById('assetEditBtn').addEventListener('click', () => {
            EventHandler.setDivDisplay([`assetEntryDiv`, `doneDiv`]);
        });
    }

    handleAssetDelete(assetDeleteList) {
        document.getElementById('assetDeleteBtn').addEventListener('click', () => {
            fetch(document.url, {
                    method: 'POST',
                    body: JSON.stringify(assetDeleteList),
                    headers: {
                        'x-requested-with': 'fetch.2',
                        'mode': 'no-cors'
                    }
                }).then((response) => {
                    console.log(response.text());
                    return response.json();
                }).catch((err) => {
                    // console.log(err);
                });
            document.getElementById('listedAssets').innerHTML = ``;
            document.getElementById(`assetListBtn`).click();
        });
    }

    handleAssetFindSubmit() {
        let self = this;
        document.getElementById('assetFindSubmit').addEventListener('click', () => {
            document.getElementById('listedAssets').innerHTML = ``;
            EventHandler.setDivDisplay([`assetListDiv`, `doneDiv`]);
            let formData = new FormData();
            formData.append('tag', document.getElementById('findAssetAssetTag').value);
            formData.append('maker', document.getElementById('findAssetMaker').value);
            formData.append('model', document.getElementById('findAssetModel').value);
            fetch(document.url, {
                method: 'POST',
                body: formData,
                headers: {
                    'x-requested-with': 'fetch.3',
                    'mode': 'no-cors'
                }
            }).then((response) => {
                return response.json();
            }).then((data) => {
                self.listAssets(data);
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    sendFormData() {
        let formData = new FormData();
        formData.append('tag', document.getElementById('assetTag').value);
        formData.append('maker', document.getElementById('assetMaker').value);
        formData.append('model', document.getElementById('assetModel').value);
        formData.append('sn', document.getElementById('serialNumber').value);
        formData.append('type', document.getElementById('assetType').value);
        formData.append('description', document.getElementById('assetDescription').value);
        formData.append('warranty', document.getElementById('assetWarranty').value);
        formData.append('purchaseDate', document.getElementById('purchaseDate').value);
        formData.append('location', document.getElementById('assetLocation').value);
        formData.append('isTitle1', this.title1);
        formData.append('isTitle9', this.title9);
        formData.append('is31a', this.thirtyOneA);
        fetch(document.url, {
            method: 'POST',
            body: formData,
            headers: {
                'x-requested-with': 'fetch.0',
                'mode': 'no-cors'
            }
        }).then((response) => {
            console.log(response.text());
            return response.json();
        }).catch((error) => {
            console.log(error);
        });
        document.getElementById('assetEntryForm').reset();
    }

    handleForward() {
        document.getElementById('forward').addEventListener('click', () => {

        });
    }

    handleBackward() {
        document.getElementById('backward').addEventListener('click', () => {

        });
    }

    static setDivDisplay(divs) {
        const DIVS = [`assetEditDiv`,`assetDeleteDiv`,`splashDiv`,`splashScanDiv`,`assetEntryDiv`,`assetListDiv`,`scanResultsExistsDiv`,`scanResultsNotExistDiv`,`assetFindDiv`,`doneDiv`, `entryResult`];
        for (let index of DIVS) {
            document.getElementById(index).style.display = `none`;
        }
        for (let div of divs) {
            document.getElementById(div).style.display = `block`;
        }
    }
}