"use strict";

export default class BCScan {
    constructor() {
        BCScan.startBCScanner();
    }

    static startBCScanner() {
        Quagga.init({
            inputStream : {
                name : "Live",
                type : "LiveStream",
                numOfWorkers: navigator.hardwareConcurrency,
                target: document.querySelector('#scanner-container'),
                constraints: {
                    /*width: 480,
                    height: 320,*/
                    width: 372,
                    height: 200,
                    facingMode: "environment"
                },
                area: { // defines rectangle of the detection/localization area
                    top: "0%",    // top offset
                    right: "0%",  // right offset
                    left: "0%",   // left offset
                    bottom: "0%"  // bottom offset
                },
            },
            decoder: {
                readers: [
                    // "ean_reader",
                    // "upc_reader",
                    "code_128_reader"
                    // "ean_8_reader",
                    // "code_39_reader",
                    // "code_39_vin_reader",
                    // "codabar_reader",
                    // "upc_e_reader",
                    // "i2of5_reader"
                ]/*,
                debug: {
                    showCanvas: true,
                    showPatches: true,
                    showFoundPatches: true,
                    showSkeleton: true,
                    showLabels: true,
                    showPatchLabels: true,
                    showRemainingPatchLabels: true,
                    boxFromPatches: {
                        showTransformed: true,
                        showTransformedBox: true,
                        showBB: true
                    }
                }*/
            },
            locator: {
                halfSample: true,
                patchSize: "medium"
            }
        }, function(err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
        });

        Quagga.onProcessed(function (result) {
            let drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function (box) {
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                    });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
                }
            }
        });

        Quagga.onDetected(function (result) {
            let getThisValueFromSQL = 0;
            if (Number(result.codeResult.code) !== getThisValueFromSQL) {
                Quagga.stop();
                document.getElementById(`splashDiv`).style.display = `none`;
                document.getElementById(`splashScanDiv`).style.display = `none`;
                document.getElementById(`scannerDiv`).style.display = `none`;
                document.getElementById(`scanResultsNotExistDiv`).style.display = `block`;
                document.getElementById(`barCode`).innerText = result.codeResult.code;
                document.getElementById(`assetTag`).value = result.codeResult.code;
            } else {
                Quagga.stop();
                document.getElementById(`splashDiv`).style.display = `none`;
                document.getElementById(`splashScanDiv`).style.display = `none`;
                document.getElementById(`scannerDiv`).style.display = `none`;
                document.getElementById(`itemEntryDiv`).style.display = `block`;
            }
        });
    }
}