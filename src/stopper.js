const Time = require("./time");

class Stopper extends Time {
    #intervalID = null;
    #needToRest = false;
    static MAX_STOPPER_SECONDS = 359999; // 99:59:59
    static MIN_STOPPER_SECONDS = 0; //00:00:00

    constructor(autoStart = false) {
        super({hours: 0, minutes: 0, seconds: 0});

        if (autoStart) {
            this.start();
        }
    }

    start() {
        if (this.#needToRest) {
            super.reset();
            this.#needToRest = false;
        }

        if (!this.#intervalID) {
            this.#intervalID = setInterval(() => {
                if (this._seconds === Stopper.MAX_STOPPER_SECONDS) {
                    this.pause();
                } else {
                    this._seconds += 1;
                }
            }, 1000)
        }
    }

    pause() {
        if (this.#intervalID) clearInterval(this.#intervalID);
        this.#intervalID = null;
    }

    stop() {
        this.pause()
        this.#needToRest = true;
    }
}

module.exports = Stopper;