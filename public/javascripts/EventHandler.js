"use strict";

import Fader from './FadeStuff.js';

export default class EventHandler {
    constructor() {
        this.fader = new Fader();
        this.handleTitleCheckBoxes();
        this.handleItemSubmit();
        this.handleItemReScan();
        this.handleItemFind();
        this.handleItemList();
        this.handleDone();
        this.handleForward();
        this.handleBackward();
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
            if (document.forms['itemEntryForm'].checkValidity()) {
                this.sendFormData();
                document.getElementById('happyFace').style.display = 'none';
                this.fader.doFade('in', 'entryResult');
                setTimeout(() => {
                    document.getElementById('entryResult').style.display = 'none';
                    this.fader.doFade('in', 'happyFace');
                }, 2000);
            } else {
                document.forms['itemEntryForm'].reportValidity();
            }
        });
    }

    handleItemReScan() {
        document.getElementById(`reScanBtn`).addEventListener(`click`, () => {
            EventHandler.setDivDisplay([`splashDiv`, `splashScanDiv`]);
        });
    }

    handleDone() {
        document.getElementById(`doneBtn`).addEventListener(`click`, () => {
            document.getElementById('listedItems').innerHTML = ``;
            document.getElementById(`itemEntryForm`).reset();
            document.getElementById(`itemFindForm`).reset();
            EventHandler.setDivDisplay([`splashDiv`, `splashScanDiv`]);
        });
    }

    handleItemFind() {
        document.getElementById(`itemFindBtn`).addEventListener(`click`, () => {
            EventHandler.setDivDisplay([`itemFindDiv`]);
            this.handleItemFindSubmit();
        });
    }

    handleItemList() {
        let self = this;
        document.getElementById(`itemListBtn`).addEventListener(`click`, () => {
            EventHandler.setDivDisplay([`itemListDiv`, `doneDiv`, `itemEditDiv`]);
            this.handleItemEdit();
            fetch(document.url, {
                method: 'POST',
                headers: {
                    'x-requested-with': 'fetch.1',
                    'mode': 'no-cors'
                }
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                self.listItems(data);
            }).catch(function (error) {
                console.log(error);
            });
        });
    }

    listItems(data) {
        if (data.length > 0) {
            let self = this;
            const MD_COLUMNS = 4;
            let itemDeleteList = [];
            for (let i = 0; i < data.length; i++) {
                let newRow = document.createElement('div');
                newRow.setAttribute('class', 'grid-x grid-padding-x grid-padding-y');
                let newCell1 = document.createElement('div');
                newCell1.setAttribute('class', 'cell small-1 large-1');
                let newCell2 = document.createElement('div');
                newCell2.setAttribute('class', 'cell small-11 large-11');
                newCell2.setAttribute('id', `listItem${i}`);
                let newItemCheck = document.createElement('input');
                newItemCheck.setAttribute('type', 'checkbox');
                newItemCheck.setAttribute('id', `itemCheck${i}`);
                newItemCheck.setAttribute('name', 'itemCheck');
                newCell1.appendChild(newItemCheck);
                document.getElementById('listedItems').appendChild(newRow);
                newRow.appendChild(newCell1);
                newItemCheck.addEventListener('click', () => {
                    let tempArray = [];
                    let itemChecks = document.forms['listedItems'].elements['itemCheck'];
                    const TAG_COLUMN = 2;
                    for (let i = 0; i < itemChecks.length; i++) {
                        if (itemChecks[i].checked) {
                            tempArray.push(data[i][TAG_COLUMN]);
                        }
                    }
                    itemDeleteList.length = 0;
                    itemDeleteList = tempArray.slice(0); // https://davidwalsh.name/javascript-clone-array
                    tempArray.length = 0;
                    if (itemDeleteList.length > 0) {
                        // console.log(itemDeleteList);
                        self.handleItemDelete(itemDeleteList);
                        EventHandler.setDivDisplay([`itemListDiv`, `doneDiv`, `itemDeleteDiv`]);
                    } else {
                        EventHandler.setDivDisplay([`itemListDiv`, `doneDiv`]);
                    }
                });
                newRow.appendChild(newCell2);
                for (let j = 0; j < MD_COLUMNS; j++) {
                    document.getElementById(`listItem${i}`).innerText += ` ${data[i][j]}`;
                }
            }
        } else {
            document.getElementById('listedItems').innerHTML = `<br><br><h1>Item does not exist in inventory.</h1>`;
        }
    }

    handleItemEdit(itemEditList) {
        document.getElementById('itemEditBtn').addEventListener('click', () => {
            EventHandler.setDivDisplay([`itemEntryDiv`, `doneDiv`]);
        });
    }

    handleItemDelete(itemDeleteList) {
        document.getElementById('itemDeleteBtn').addEventListener('click', () => {
            fetch(document.url, {
                    method: 'POST',
                    body: JSON.stringify(itemDeleteList),
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
            document.getElementById('listedItems').innerHTML = ``;
            document.getElementById(`itemListBtn`).click();
        });
    }

    handleItemFindSubmit() {
        let self = this;
        document.getElementById('itemFindSubmit').addEventListener('click', () => {
            document.getElementById('listedItems').innerHTML = ``;
            EventHandler.setDivDisplay([`itemListDiv`, `doneDiv`]);
            let formData = new FormData();
            formData.append('tag', document.getElementById('findItemAssetTag').value);
            formData.append('maker', document.getElementById('findItemMaker').value);
            formData.append('model', document.getElementById('findItemModel').value);
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
                self.listItems(data);
            }).catch((err) => {
                console.log(err);
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
        formData.append('location', document.getElementById('itemLocation').value);
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
        document.getElementById('itemEntryForm').reset();
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
        const DIVS = [`itemEditDiv`,`itemDeleteDiv`,`splashDiv`,`splashScanDiv`,`itemEntryDiv`,`itemListDiv`,`scanResultsExistsDiv`,`scanResultsNotExistDiv`,`itemFindDiv`,`doneDiv`, `entryResult`];
        for (let index of DIVS) {
            document.getElementById(index).style.display = `none`;
        }
        for (let div of divs) {
            document.getElementById(div).style.display = `block`;
        }
    }
}