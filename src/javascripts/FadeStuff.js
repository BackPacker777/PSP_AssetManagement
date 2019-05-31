"use strict";

/**
 * @module FadeStuff
 */

/**
 * @desc Library class for fading DOM elements in/out
 */
export default class FadeStuff {
    /**
     * @desc Constructor
     */
    constructor() {}

    /**
     *
     * @param direction
     * @param fadeWhat
     * @desc Method that performs fades
     */
    doFade(direction, fadeWhat) {
        //http://www.chrisbuttery.com/articles/fade-in-fade-out-with-javascript/
        let div = document.getElementById(fadeWhat);
        if (direction === "in") {
            div.style.opacity = 0;
            // div.style.visibility = 'visible';
            div.style.display = `block`;
            (function fade() {
                let val = parseFloat(div.style.opacity);
                if (!((val += .01) >= 1)) {
                    div.style.opacity = val;
                    requestAnimationFrame(fade);
                }
            })();
        } else if (direction === "out") {
            div.style.opacity = 1;
            (function fade() {
                if ((div.style.opacity -= .01) <= 0) {
                    // div.style.visibility = 'hidden';
                    div.style.display = `none`;
                } else {
                    requestAnimationFrame(fade);
                }
            })();
        }
    }
}