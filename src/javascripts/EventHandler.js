"use strict";

import Fader from './FadeStuff.js';
import BCScan from './BCScan.js';

/**
 * @module EventHandler
 */

/**
 * @desc Class that handles all DOM events. Performs all fetch operations
 */
export default class EventHandler {
    /**
     * @desc Instantiates Fader and starts select event listeners
     */
    constructor() {
        this.fader = new Fader();
        this.doFindSubmit = function(whichData, findData) {
            self.handleAssetFindSubmit(whichData, findData);
        };
        this.handleAssetEntryBtn();
        this.handleAssetFind();
        this.handleAssetList();
        this.handleSplashScanBtn();
        this.handleTitleCheckBoxes();
        this.handleDone();
        this.handleAssetSubmit();
    }

    /**
     *
     */
    handleAssetEntryBtn() {
        document.getElementById(`assetEntryBtn`).addEventListener(`click`, (event) => {
            event.stopImmediatePropagation();
            EventHandler.setDivDisplay([`assetEntryDiv`,`doneDiv`]);
            EventHandler.enableDisableInputs([`assetTag`]);
            this.handleEnterAssetTag();
        });
    }

    /**
     *
     */
    handleAssetFind() {
        self = this;
        document.getElementById(`assetFindBtn`).addEventListener(`click`, (event) => {
            event.stopImmediatePropagation();
            let findDivs = [`findAssetModel`,`findAssetMaker`];
            for (let div of findDivs) {
                document.getElementById(div).options.length = 0;
                let option = document.createElement("option");
                option.text = `CHOOSE`;
                option.value = `CHOOSE`;
                document.getElementById(div).appendChild(option);
            }
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

            EventHandler.setDivDisplay([`assetFindDiv`, `doneDiv`]);
            EventHandler.enableDisableInputs([`findAssetMaker`,`findAssetModel`,`findAssetTag`,`findAssetLocation`]);
            let findData = null;
            let doSubmit = function(whichData) {
                self.handleAssetFindSubmit(whichData, findData);
            };
            document.getElementById("findAssetMaker").addEventListener('change', (event) => {
                event.stopImmediatePropagation();
                let findAssetMaker = document.getElementById('findAssetMaker');
                let findAssetMakerValue = findAssetMaker.options[findAssetMaker.selectedIndex].value;
                if (findAssetMakerValue !== 'CHOOSE') {
                    findData = findAssetMakerValue;
                    this.doFindSubmit('maker', findData);
                } else {
                    findData = null;
                }
            });
            document.getElementById("findAssetModel").addEventListener('change', (event) => {
                event.stopImmediatePropagation();
                let findAssetModel = document.getElementById('findAssetModel');
                let findAssetModelValue = findAssetModel.options[findAssetModel.selectedIndex].value;
                if (findAssetModelValue !== 'CHOOSE') {
                    findData = findAssetModelValue;
                    doSubmit('model', findData);
                } else {
                    findData = null;
                }
            });
            document.getElementById("findAssetTag").addEventListener('change', (event) => {
                event.stopImmediatePropagation();
                if (document.getElementById("findAssetTag").value) {
                    findData = document.getElementById("findAssetTag").value;
                    doSubmit('tag', findData);
                } else {
                    findData = null;
                }
            });
            document.getElementById("findAssetLocation").addEventListener('change', (event) => {
                event.stopImmediatePropagation();
                if (document.getElementById("findAssetLocation").value) {
                    findData = document.getElementById("findAssetLocation").value;
                    doSubmit('location', findData);
                } else {
                    findData = null;
                }
            });
        });
    }

    /**
     *
     * @param whichData
     * @param findData
     * @param isScan
     */
    handleAssetFindSubmit(whichData, findData, isScan) {
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
            } else if (isScan) {
                EventHandler.setDivDisplay([`assetEntryDiv`,`doneDiv`]);
                EventHandler.enableDisableInputs([`assetTag`,`assetMaker`]);
                document.getElementById(`assetTag`).value = findData;
                let event = new Event('change');
                document.getElementById(`assetTag`).dispatchEvent(event);
            } else {
                document.getElementById('assetListDivResults').innerHTML = `<br><br><h1>Asset does not exist in inventory.</h1>`;
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    /**
     * @desc Grabs assets from DB
     */
    handleAssetList() {
        let self = this;
        document.getElementById(`assetListBtn`).addEventListener(`click`, (event) => {
            event.stopImmediatePropagation();
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
                    document.getElementById('assetListDivResults').innerHTML = `<br><br><h1>Asset does not exist in inventory.</h1>`;
                }
            }).catch(function (error) {
                console.log(error);
            });
        });
    }

    /**
     *
     * @param data
     */
    listAssets(data) {
        for (let i = 0; i < data.length; i++) {
            let newRow = document.createElement('div');
            newRow.setAttribute('class', 'grid-x');
            newRow.setAttribute('id', `listAsset.${i}`);
            if (i % 2 === 0) {
                newRow.style.backgroundColor = 'gray';
            }
            document.getElementById('assetListDivResults').appendChild(newRow);
            newRow.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
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

    /**
     *
     */
    handleSplashScanBtn() {
        let counter = 0;
        let self = this;
        document.getElementById(`splashScanBtn`).addEventListener(`click`, (event) => {
            event.stopImmediatePropagation();
            EventHandler.setDivDisplay([`splashDiv`,`scannerContainer`]);
            // self.handleAssetFindSubmit('tag', 1118, true);
            BCScan.startBCScanner((barCode) => {
                counter++;
                console.log(counter);
                self.handleAssetFindSubmit('tag', barCode, true);
            });
        });
    }

    /**
     *
     */
    handleEnterAssetTag() {
        document.getElementById(`assetLocation`).value = '';
        const MAX_TAG = 99999999;
        document.getElementById(`assetTag`).addEventListener(`change`, (event) => {
            event.stopImmediatePropagation();
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
                        EventHandler.enableDisableInputs([`assetTag`,`assetMaker`]);
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

    /**
     *
     * @param assetProperties
     */
    handleAssetMaker(assetProperties) {
        document.getElementById("assetMaker").options.length = 0;
        let option = document.createElement("option");
        option.text = `CHOOSE`;
        option.value = `CHOOSE`;
        document.getElementById("assetMaker").appendChild(option);
        this.populateAssetData(4, (assetData) => {
            for (let i = 0; i < assetData.length; i++) {
                let option = document.createElement("option");
                option.text = assetData[i][0];
                option.value = assetData[i][0];
                document.getElementById("assetMaker").appendChild(option);
            }
            if (assetProperties) {
                document.getElementById("assetMaker").value = assetProperties.maker;
                let assetVendorValue = assetProperties.maker;
                this.handleAssetType(assetData, assetVendorValue, assetProperties);
                EventHandler.enableDisableInputs([`assetTag`,`assetMaker`,`assetType`,`serialNumber`,`assetModel`,`assetDescription`,`assetLocation`,`purchaseDate`,`assetWarranty`,`bad`,`title1`,`title9`,`31a`,`assetSubmit`]);

            } else {
                document.getElementById(`assetLocation`).value = '';
                EventHandler.enableDisableInputs([`assetTag`,`assetMaker`,`assetType`]);
            }
            document.getElementById(`assetMaker`).addEventListener(`change`, (event) => {
                event.stopImmediatePropagation();
                let assetVendor = document.getElementById('assetMaker');
                let assetVendorValue = assetVendor.options[assetVendor.selectedIndex].value;
                this.handleAssetType(assetData, assetVendorValue, null);
            });
        });
    }

    /**
     *
     * @param assetData
     * @param assetVendorValue
     * @param assetProperties
     */
    handleAssetType(assetData, assetVendorValue, assetProperties) {
        document.getElementById("assetType").options.length = 0;
        let option = document.createElement("option");
        option.text = `CHOOSE`;
        option.value = `CHOOSE`;
        document.getElementById("assetType").appendChild(option);
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
        if (assetProperties) {
            document.getElementById("assetType").value = assetProperties.type;
            let assetTypeValue = assetProperties.type;
            this.handleAssetModel(assetTypeValue, assetProperties);
        } else {
            document.getElementById(`assetLocation`).value = '';
            EventHandler.enableDisableInputs([`assetTag`,`assetMaker`,`assetType`,`serialNumber`,`assetModel`]);
        }
        document.getElementById(`assetType`).addEventListener(`change`, (event) => {
            event.stopImmediatePropagation();
            let assetType = document.getElementById('assetType');
            let assetTypeValue = assetType.options[assetType.selectedIndex].value;
            this.handleAssetModel(assetTypeValue, null);
        });
    }

    /**
     *
     * @param assetTypeValue
     * @param assetProperties
     */
    handleAssetModel(assetTypeValue, assetProperties) {
        document.getElementById("assetModel").options.length = 0;
        let option = document.createElement("option");
        option.text = `CHOOSE`;
        option.value = `CHOOSE`;
        document.getElementById("assetModel").appendChild(option);
        this.populateAssetData(5, (assetData) => {
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
            if (assetProperties) {
                document.getElementById("assetModel").value = assetProperties.model;
            } else {
                document.getElementById(`assetLocation`).value = '';
                EventHandler.enableDisableInputs([`assetTag`,`assetMaker`,`assetType`,`serialNumber`,`assetModel`,`assetLocation`]);
            }
            this.handleEnterLocation();
        });
    }

    /**
     *
     */
    handleEnterLocation() {
        document.getElementById(`assetLocation`).addEventListener(`change`, (event) => {
            event.stopImmediatePropagation();
            if (!(/[0-9][0-9][0-9][clwshmxftz]/i).test(document.getElementById(`assetLocation`).value)) {
                alert(`Incorrect location entered. Please try again Ding Dong!`);
                document.getElementById(`assetLocation`).value = "";
            } else {
                EventHandler.setDivDisplay([`assetEntryDiv`,`doneDiv`,`assetTag`,`assetMaker`,`assetType`,`serialNumber`,`assetModel`,`assetDescription`,`assetLocation`,`purchaseDate`,`assetWarranty`]);
                EventHandler.enableDisableInputs([`assetTag`,`assetMaker`,`assetType`,`serialNumber`,`assetModel`,`assetLocation`,`assetDescription`,`bad`,`title1`,`title9`,`31a`,`assetSubmit`,`purchaseDate`,`assetWarranty`]);
                this.handleAssetSubmit();
            }
        });
    }


    handleTitleCheckBoxes() {
        let self = this;
        this.bad = 0;
        this.title1 = 0;
        this.title9 = 0;
        this.thirtyOneA = 0;
        let checkBoxes = document.getElementsByName('titleCheckBox');
        for (let i = 0; i < checkBoxes.length; i++) {
            let boxValue = null;
            checkBoxes[i].addEventListener(`click`, (event) => {
                event.stopImmediatePropagation();
                if (document.getElementById('bad').checked === true) {
                    self.bad = 1;
                } else {
                    self.bad = 0;
                }
                if (document.getElementById('title1').checked === true) {
                    self.title1 = 1;
                } else {
                    self.title1 = 0;
                }
                if (document.getElementById('title9').checked === true) {
                    self.title9 = 1;
                } else {
                    self.title9 = 0;
                }
                if (document.getElementById('31a').checked === true) {
                    self.thirtyOneA = 1;
                } else {
                    self.thirtyOneA = 0;
                }
                // console.log(self.bad);
            });
        }
    }

    /**
     *
     */
    handleDone() {
        document.getElementById(`doneBtn`).addEventListener(`click`, (event) => {
            event.stopImmediatePropagation();
            document.getElementById('assetListDivResults').innerHTML = ``;
            document.getElementById(`assetEntryForm`).reset();
            document.getElementById(`assetFindForm`).reset();
            EventHandler.setDivDisplay([`splashDiv`,`splashScanDiv`]);
            EventHandler.enableDisableInputs([`assetEntryBtn`,`assetFindBtn`,`assetListBtn`,`splashScanBtn`]);
            EventHandler.setDivDisplay([`splashDiv`, `splashScanDiv`]);
        });
    }

    /**
     *
     * @param tagNumber
     */
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
            EventHandler.setDivDisplay([`assetEntryDiv`,`doneDiv`]);
            EventHandler.enableDisableInputs([`assetTag`,`assetMaker`,`assetType`,`serialNumber`,`assetModel`,`assetDescription`,`assetLocation`,`purchaseDate`,`assetWarranty`,`bad`,`title1`,`title9`,`31a`,`assetSubmit`]);

            document.getElementById('assetTag').value = assetProperties.tag;
            document.getElementById('assetLocation').value = assetProperties.location;
            document.getElementById('serialNumber').value = assetProperties.sn;
            document.getElementById('assetDescription').value = assetProperties.description;
            document.getElementById('purchaseDate').value = assetProperties.purchaseDate;
            document.getElementById('assetWarranty').value = assetProperties.warranty;
            if (Number(assetProperties.bad) === 1) {
                document.getElementById('bad').checked = true;
            }
            if (Number(assetProperties.isTitle1) === 1) {
                document.getElementById('title1').checked = true;
            }
            if (Number(assetProperties.isTitle9) === 1) {
                document.getElementById('title9').checked = true;
            }
            if (Number(assetProperties.is31a) === 1) {
                document.getElementById('31a').checked = true;
            }
            this.handleAssetMaker(assetProperties);
        }).catch((err) => {
            console.log(err);
        });
    }

    /**
     * @desc Primary Fetch method
     */
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
        formData.append('isBad', this.bad);
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

    /**
     *
     */
    handleAssetSubmit() {
        document.getElementById(`assetSubmit`).addEventListener(`click`, (event) => {
            event.stopImmediatePropagation();
            if (document.forms['assetEntryForm'].checkValidity()) {
                this.sendFormData();
                document.getElementById('happyFace').style.display = 'none';
                this.fader.doFade('in', 'entryResult');
                setTimeout(() => {
                    document.getElementById('entryResult').style.display = 'none';
                    this.fader.doFade('in', 'happyFace');
                }, 2000);
                EventHandler.enableDisableInputs(['assetTag']);
            } else {
                document.forms['assetEntryForm'].reportValidity();
            }
        });
    }

    /**
     *
     * @param whichData
     * @param callback
     * @desc Utility method for fetching DOM element data
     */
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

    /**
     *
     * @param inputs
     */
    static enableDisableInputs(inputs) {
        // const INPUTS = [`assetTag`,`assetMaker`,`assetType`,`serialNumber`,`assetModel`,`assetDescription`,`assetLocation`,`purchaseDate`,`assetWarranty`,`bad`,`title1`,`title9`,`31a`,`assetSubmit`,`findAssetMaker`,`findAssetModel`,`findAssetTag`,`findAssetLocation`,`assetEntryBtn`,`assetFindBtn`,`assetListBtn`,`splashScanBtn`];
        const INPUTS = [`assetTag`,`assetMaker`,`assetType`,`serialNumber`,`assetModel`,`assetDescription`,`assetLocation`,`purchaseDate`,`assetWarranty`,`bad`,`title1`,`title9`,`31a`,`assetSubmit`,`findAssetMaker`,`findAssetModel`,`findAssetTag`,`findAssetLocation`,`assetEntryBtn`,`assetFindBtn`,`assetListBtn`];
        for (let index of INPUTS) {
            document.getElementById(index).disabled = true;
        }
        for (let input of inputs) {
            document.getElementById(input).disabled = false;
        }
    }

    /**
     *
     * @param divs
     */
    static setDivDisplay(divs) {
        const DIVS = [`splashDiv`,`splashScanDiv`,`assetEntryDiv`,`assetListDiv`,`assetListDivResults`,`scanResultsExistsDiv`,`scanResultsNotExistDiv`,`assetFindDiv`,`doneDiv`,`entryResult`,`scannerContainer`];
        for (let index of DIVS) {
            if (document.getElementById(index)) {
                document.getElementById(index).style.display = `none`;
            }
        }
        for (let div of divs) {
            document.getElementById(div).style.display = `block`;
        }
    }
}