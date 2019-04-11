"use strict";

import Fader from './FadeStuff.js';

export default class EventHandler {
    constructor() {
        this.fader = new Fader();
        this.doFindSubmit = function(whichData, findData) {
            document.getElementById("findAssetMaker").disabled = false;
            document.getElementById("findAssetModel").disabled = false;
            document.getElementById("findAssetTag").disabled = false;
            document.getElementById("findAssetLocation").disabled = false;
            self.handleAssetFindSubmit(whichData, findData);
        };
        this.handleAssetTag();
        this.handleTitleCheckBoxes();
        this.handleAssetSubmit();
        this.handleAssetReScan();
        this.handleAssetFind();
        this.handleAssetList();
        this.handleDone();
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
        document.getElementById(`assetTag`).addEventListener(`change`, () => {
            let tagValue = Number(document.getElementById(`assetTag`).value);
            if (tagValue > 0 && tagValue < MAX_TAG) {
                fetch(document.url, {
                    method: 'POST',
                    body: tagValue,
                    headers: {
                        'x-requested-with': 'fetch.6',
                        'mode': 'no-cors'
                    }
                }).then((response) => {
                    return response.json();
                }).then((tagExists) => {
                    if (tagExists) {
                        alert(`Tag number exists, please re-enter.`);
                        document.getElementById(`assetMaker`).disabled = true;
                        document.getElementById(`assetTag`).value = "";
                    } else {
                        document.getElementById(`assetMaker`).disabled = false;
                        this.handleAssetMaker();
                    }
                }).catch((err) => {
                    console.log(err);
                });
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
            document.getElementById('assetListDiv').innerHTML = ``;
            document.getElementById(`assetEntryForm`).reset();
            document.getElementById(`assetFindForm`).reset();
            EventHandler.setDivDisplay([`splashDiv`, `splashScanDiv`]);
        });
    }

    handleAssetFind() {
        self = this;
        document.getElementById(`assetFindBtn`).addEventListener(`click`, () => {
            document.getElementById('assetFindSubmit').disabled = true;
            EventHandler.setDivDisplay([`assetFindDiv`, `doneDiv`]);
            this.populateAssetData(4, (assetData) => {
                for (let i = 0; i < assetData.length; i++) {
                    let option = document.createElement("option");
                    option.text = assetData[i][0];
                    option.value = assetData[i][0];
                    document.getElementById("findAssetMaker").appendChild(option);
                }
            });
            this.populateAssetData(5, (assetData) => {
                for (let i = 1; i < assetData.length; i++) {
                    for (let j = 1; j < assetData[i].length; j++) {
                        let option = document.createElement("option");
                        option.text = assetData[i][j];
                        option.value = assetData[i][j];
                        document.getElementById("findAssetModel").appendChild(option);
                    }
                }
            });
            let findData = null;
            let doSubmit = function (whichData) {
                self.handleAssetFindSubmit(whichData, findData);
            };
            document.getElementById("findAssetMaker").addEventListener('change', () => {
                let findAssetMaker = document.getElementById('findAssetMaker');
                let findAssetMakerValue = findAssetMaker.options[findAssetMaker.selectedIndex].value;
                if (findAssetMakerValue !== 'choose') {
                    findData = findAssetMakerValue;
                    document.getElementById("findAssetModel").disabled = true;
                    document.getElementById("findAssetTag").disabled = true;
                    document.getElementById("findAssetLocation").disabled = true;
                    document.getElementById('assetFindSubmit').disabled = false;
                    document.getElementById('assetFindSubmit').addEventListener('click', this.doFindSubmit('maker', findData));
                } else {
                    findData = null;
                    document.getElementById("findAssetModel").disabled = false;
                    document.getElementById("findAssetTag").disabled = false;
                    document.getElementById("findAssetLocation").disabled = false;
                    document.getElementById('assetFindSubmit').disabled = true;
                    document.getElementById('assetFindSubmit').removeEventListener('click', doSubmit());
                }
            });
            document.getElementById("findAssetModel").addEventListener('change', () => {
                let findAssetModel = document.getElementById('findAssetModel');
                let findAssetModelValue = findAssetModel.options[findAssetModel.selectedIndex].value;
                if (findAssetModelValue !== 'choose') {
                    findData = findAssetModelValue;
                    document.getElementById("findAssetMaker").disabled = true;
                    document.getElementById("findAssetTag").disabled = true;
                    document.getElementById("findAssetLocation").disabled = true;
                    document.getElementById('assetFindSubmit').disabled = false;
                    document.getElementById('assetFindSubmit').addEventListener('click', doSubmit('model'));
                } else {
                    findData = null;
                    document.getElementById("findAssetMaker").disabled = false;
                    document.getElementById("findAssetTag").disabled = false;
                    document.getElementById("findAssetLocation").disabled = false;
                    document.getElementById('assetFindSubmit').disabled = true;
                    document.getElementById('assetFindSubmit').removeEventListener('click', doSubmit);
                }
            });
            document.getElementById("findAssetTag").addEventListener('change', () => {
                if (document.getElementById("findAssetTag").value) {
                    findData = document.getElementById("findAssetTag").value;
                    document.getElementById("findAssetModel").disabled = true;
                    document.getElementById("findAssetMaker").disabled = true;
                    document.getElementById("findAssetLocation").disabled = true;
                    document.getElementById('assetFindSubmit').disabled = false;
                    document.getElementById('assetFindSubmit').addEventListener('click', doSubmit('tag'));
                } else {
                    findData = null;
                    document.getElementById("findAssetModel").disabled = false;
                    document.getElementById("findAssetMaker").disabled = false;
                    document.getElementById("findAssetLocation").disabled = false;
                    document.getElementById('assetFindSubmit').disabled = true;
                    document.getElementById('assetFindSubmit').removeEventListener('click', doSubmit);
                }
            });
            document.getElementById("findAssetLocation").addEventListener('change', () => {
                if (document.getElementById("findAssetLocation").value) {
                    findData = document.getElementById("findAssetLocation").value;
                    document.getElementById("findAssetModel").disabled = true;
                    document.getElementById("findAssetMaker").disabled = true;
                    document.getElementById("findAssetTag").disabled = true;
                    document.getElementById('assetFindSubmit').disabled = false;
                    document.getElementById('assetFindSubmit').addEventListener('click', doSubmit('location'));
                } else {
                    findData = null;
                    document.getElementById("findAssetModel").disabled = false;
                    document.getElementById("findAssetMaker").disabled = false;
                    document.getElementById("findAssetTag").disabled = false;
                    document.getElementById('assetFindSubmit').disabled = true;
                    document.getElementById('assetFindSubmit').removeEventListener('click', doSubmit);
                }
            });
        });
    }

    handleAssetFindSubmit(whichData, findData) {
        let data = `${whichData},${findData}`;
        let self = this;
        document.getElementById('assetFindForm').reset();
        EventHandler.setDivDisplay([`assetListDiv`, `doneDiv`]);
        fetch(document.url, {
            method: 'POST',
            body: data,
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
    }

    handleAssetList() {
        let self = this;
        document.getElementById(`assetListBtn`).addEventListener(`click`, () => {
            EventHandler.setDivDisplay([`assetListDiv`, `doneDiv`]);
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
            for (let i = 0; i < data.length; i++) {
                let newRow = document.createElement('div');
                newRow.setAttribute('class', 'grid-x');
                newRow.setAttribute('id', `listAsset${i}`);
                document.getElementById('assetListDiv').appendChild(newRow);
                newRow.addEventListener('click', () => {
                    alert('Editing item!');
                });

                for (let j = 0; j < data[0].length; j++) {
                    let cell = document.createElement('div');
                    cell.setAttribute('class', 'cell small-3 large-3');
                    cell.innerText = data[i][j];
                    newRow.appendChild(cell);
                }

                let cells = [];
                /*for (let j = 0; j < data[0].length; j++) {
                    cells[i] = [];
                    cells[i][j] = document.createElement('div');
                    cells[i][j].setAttribute('class', 'cell small-12 large-12');
                    cells[i][j].innerText = data[i][j];
                    newRow.appendChild(cells[i][j]);
                    document.getElementById(`listAsset${i}`).innerText += ` ${data[i][j]}`;
                }*/
            }
        } else {
            document.getElementById('listedAssets').innerHTML = `<br><br><h1>Asset does not exist in inventory.</h1>`;
        }
    }

    handleAssetEdit() {

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

    static setDivDisplay(divs) {
        const DIVS = [`assetDeleteDiv`,`splashDiv`,`splashScanDiv`,`assetEntryDiv`,`assetListDiv`,`scanResultsExistsDiv`,`scanResultsNotExistDiv`,`assetFindDiv`,`doneDiv`, `entryResult`];
        for (let index of DIVS) {
            document.getElementById(index).style.display = `none`;
        }
        for (let div of divs) {
            document.getElementById(div).style.display = `block`;
        }
    }
}