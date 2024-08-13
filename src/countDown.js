const {Time} = require("./time");

module.exports.CountDown =
    class CountDown extends Time {

        #intervalID = null;
        #needToRest = false;
        #startingTIme;
        static MAX_COUNTDOWN_SECONDS = 359999; // 99:59:00
        static MIN_COUNTDOWN_SECONDS = 0; //00:00:00

        constructor(time = {}) {
            if (Object.keys(time).length === 0) throw new Error("Time must be specified");

            super(time);
            this.#validateTime()
            this.#startingTIme = this._seconds;
        }

        #validateTime() {
            if (this._seconds > CountDown.MAX_COUNTDOWN_SECONDS) this._seconds = CountDown.MAX_COUNTDOWN_SECONDS;
            else if (this._seconds < CountDown.MIN_COUNTDOWN_SECONDS) this._seconds = CountDown.MIN_COUNTDOWN_SECONDS;
        }

        start(callBack) {
            if (this.#needToRest) {
                this.reset();
                this.#needToRest = false;
            }

            if (!this.#intervalID) {
                this.#intervalID = setInterval(() => {
                    if (this._seconds === CountDown.MIN_COUNTDOWN_SECONDS) {
                        callBack();
                        this.pause()
                    }
                    else this._seconds -= 1;
                }, 1000)
            }
        }

        reset() {
            this._seconds = this.#startingTIme;
        }

        pause() {
            if (this.#intervalID) clearInterval(this.#intervalID);
            this.#intervalID = null;
        }

        stop() {
            clearInterval(this.#intervalID);
            this.#intervalID = null;
            this.#needToRest = true;
        }

    }