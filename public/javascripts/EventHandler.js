"use strict";

export default class EventHandler {
    constructor(data) {
        this.variable = data;
        this.handleButtons();
        this.handleCamera();
    }

    displayVariable() {
        console.log(this.variable);
    }

    handleButtons() {
        for (let i = 0; i < document.getElementsByName('formSubmit').length; i++) {
            document.getElementsByName('formSubmit')[i].addEventListener('click', () => {

            });
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
            player.srcObject.getVideoTracks().forEach(track => track.stop());
        });
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                player.srcObject = stream;
        });
    }
}