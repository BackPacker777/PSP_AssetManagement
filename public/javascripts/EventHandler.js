"use strict";

import Fader from './FadeStuff.js';

export default class EventHandler {
    constructor() {
        this.fader = new Fader();
        this.doFindSubmit = function(whichData, findData) {
            self.handleAssetFindSubmit(whichData, findData);
        };
        this.handleEnterAssetTag();
        this.handleEnterLocation();
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

    handleEnterAssetTag() {
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

    handleEnterLocation() {
        document.getElementById(`assetLocation`).addEventListener(`change`, () => {
            if (!(/[0-9][0-9][0-9][clwshmxftz]/i).test(document.getElementById(`assetLocation`).value)) {
                alert(`Incorrect location entered. Please try again Ding Dong!`);
                document.getElementById(`assetLocation`).value = "";
            }
        });
    }

    handleAssetMaker(assetProperties) {
        this.populateAssetData(4, (assetData) => {
            for (let i = 0; i < assetData.length; i++) {
                let option = document.createElement("option");
                option.text = assetData[i][0];
                option.value = assetData[i][0];
                document.getElementById("assetMaker").appendChild(option);
            }
            if (assetProperties) {
                document.getElementById("assetMaker").value = assetProperties.maker;
                this.handleAssetType(assetData, assetProperties);
            } else {
                document.getElementById(`assetMaker`).addEventListener(`change`, () => {
                    document.getElementById(`assetType`).disabled = false;
                    this.handleAssetType(assetData);
                });
            }
        });
    }

    handleAssetType(assetData, assetProperties) {
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
        if (! assetProperties) {
            document.getElementById(`assetType`).addEventListener(`change`, () => {
                document.getElementById(`serialNumber`).disabled = false;
                document.getElementById(`assetModel`).disabled = false;
                this.handleAssetModel();
            });
        } else {
            document.getElementById("assetType").value = assetProperties.type;
            this.handleAssetModel(assetProperties);
        }
    }

    handleAssetModel(assetProperties) {
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
            if (assetProperties) {
                document.getElementById("assetModel").value = assetProperties.model;
            }
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
            document.getElementById('assetListDivResults').style.display = 'none';
            document.getElementById('assetListDivResults').innerHTML = ``;
            document.getElementById(`assetEntryForm`).reset();
            document.getElementById(`assetFindForm`).reset();
            document.getElementById("findAssetMaker").disabled = false;
            document.getElementById("findAssetModel").disabled = false;
            document.getElementById("findAssetTag").disabled = false;
            document.getElementById("findAssetLocation").disabled = false;
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
                    document.getElementById('assetFindSubmit').addEventListener('click', doSubmit('model', findData));
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
                    document.getElementById('assetFindSubmit').addEventListener('click', doSubmit('tag', findData));
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
                    document.getElementById('assetFindSubmit').addEventListener('click', doSubmit('location', findData));
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
        EventHandler.setDivDisplay([`assetListDiv`, `assetListDivResults`, `doneDiv`]);
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
            if (data.length > 0) {
                self.listAssets(data);
            } else {
                document.getElementById('assetListDivResults').innerHTML = `<br><br><h1>Asset does not exist in inventory.</h1>`;
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    handleAssetList() {
        let self = this;
        document.getElementById(`assetListBtn`).addEventListener(`click`, () => {
            EventHandler.setDivDisplay([`assetListDiv`, `assetListDivResults`, `doneDiv`]);
            fetch(document.url, {
                method: 'POST',
                headers: {
                    'x-requested-with': 'fetch.1',
                    'mode': 'no-cors'
                }
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                if (data.length > 0) {
                    self.listAssets(data);
                } else {
                    document.getElementById('\'assetListDivResults').innerHTML = `<br><br><h1>Asset does not exist in inventory.</h1>`;
                }
            }).catch(function (error) {
                console.log(error);
            });
        });
    }

    listAssets(data) {
        for (let i = 0; i < data.length; i++) {
            let newRow = document.createElement('div');
            newRow.setAttribute('class', 'grid-x');
            newRow.setAttribute('id', `listAsset.${i}`);
            if (i % 2 === 0) {
                newRow.style.backgroundColor = 'gray';
            }
            document.getElementById('assetListDivResults').appendChild(newRow);
            newRow.addEventListener('click', () => {
                let tagParent = event.currentTarget.id;
                let tagNumber = tagParent.slice(10);
                this.handleAssetEdit(tagNumber);
            });

            for (let j = 0; j < data[0].length; j++) {
                let cell = document.createElement('div');
                if (j === 0) {
                    cell.setAttribute('id', `tag.${i}`);
                    cell.setAttribute('class', 'cell small-2 large-2');
                } else if (j === 1) {
                    cell.setAttribute('class', 'cell small-3 large-3');
                } else if (j === 2) {
                    cell.setAttribute('class', 'cell small-3 large-3');
                } else {
                    cell.setAttribute('class', 'cell small-4 large-4');
                }
                cell.innerText = data[i][j];
                newRow.appendChild(cell);
            }
        }
    }

    handleAssetEdit(tagNumber) {
        let tagNum = `tag.${tagNumber}`;
        let tag = document.getElementById(tagNum).innerText;
        fetch(document.url, {
            method: 'POST',
            body: tag,
            headers: {
                'x-requested-with': 'fetch.7',
                'mode': 'no-cors'
            }
        }).then((response) => {
            return response.json();
        }).then((assetProperties) => {
            document.getElementById(`assetListDiv`).style.display = `none`;
            document.getElementById(`splashDiv`).style.display = `none`;
            document.getElementById(`scanResultsExistsDiv`).style.display = `none`;
            document.getElementById(`scanResultsNotExistDiv`).style.display = `none`;
            document.getElementById(`entryResult`).style.display = `none`;
            document.getElementById(`assetEntryDiv`).style.display = `block`;
            document.getElementById(`doneDiv`).style.display = `block`;

            document.getElementById(`assetMaker`).disabled = false;
            document.getElementById(`assetType`).disabled = false;
            document.getElementById(`serialNumber`).disabled = false;
            document.getElementById(`assetModel`).disabled = false;
            document.getElementById(`assetDescription`).disabled = false;
            document.getElementById(`assetLocation`).disabled = false;
            document.getElementById(`purchaseDate`).disabled = false;
            document.getElementById(`assetWarranty`).disabled = false;
            document.getElementById(`title1`).disabled = false;
            document.getElementById(`title9`).disabled = false;
            document.getElementById(`31a`).disabled = false;
            document.getElementById(`assetSubmit`).disabled = false;

            this.handleAssetMaker(assetProperties);

            document.getElementById('assetTag').value = assetProperties.tag;
            document.getElementById('serialNumber').value = assetProperties.sn;
            document.getElementById('assetDescription').value = assetProperties.description;
            document.getElementById('assetLocation').value = assetProperties.location;
            document.getElementById('purchaseDate').value = assetProperties.purchaseDate;
            document.getElementById('assetWarranty').value = assetProperties.warranty;
            document.getElementById('title1').value = assetProperties.isTitle1;
            document.getElementById('title9').value = assetProperties.isTitle9;
            document.getElementById('31a').value = assetProperties.is31a;
        }).catch((err) => {
            console.log(err);
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
        const DIVS = [`assetDeleteDiv`,`splashDiv`,`splashScanDiv`,`assetEntryDiv`,`assetListDiv`,`assetListDivResults`,`scanResultsExistsDiv`,`scanResultsNotExistDiv`,`assetFindDiv`,`doneDiv`, `entryResult`];
        for (let index of DIVS) {
            document.getElementById(index).style.display = `none`;
        }
        for (let div of divs) {
            document.getElementById(div).style.display = `block`;
        }
    }
}