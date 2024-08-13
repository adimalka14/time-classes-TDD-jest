const {Time} = require('./time');

module.exports.Clock =
    class Clock extends Time {

        #intervalID = null;
        static MAX_TIME_SECONDS = 86399; // 23:59:59
        static MiN_TIME_SECONDS = 0; //00:00:00

        constructor(time = {}, autoStart = true) {
            super(time);
            this.#validateTime();
            if (autoStart) this.start();
        }

        #validateTime() {
            if (this.totalSeconds > Clock.MAX_TIME_SECONDS)
                this._seconds = Clock.MAX_TIME_SECONDS;
            else if (this.totalSeconds < Clock.MIN_TIME_SECONDS)
                this._seconds = Clock.MIN_TIME_SECONDS;
        }

        start() {
            if (!this.#intervalID) {
                this.#intervalID = setInterval(() => {
                    this._seconds = (this._seconds + 1) % (Clock.MAX_TIME_SECONDS + 1);
                }, 1000);
            }
        }

        pause() {
            clearInterval(this.#intervalID);
            this.#intervalID = null;
        }
    }