const Time = require('./time');

class Clock extends Time {
    #intervalID = null;
    static MAX_TIME_SECONDS = 86399; // 23:59:59
    static MiN_TIME_SECONDS = 0; //00:00:00

    constructor(time = {}, autoStart = true) {
        super(time);
        this.#validateAndUpdateTime();
        if (autoStart) {
            this.start();
        }
    }

    #validateAndUpdateTime() {
        if (this.totalSeconds > Clock.MAX_TIME_SECONDS) {
            this._seconds = Clock.MAX_TIME_SECONDS;
        } else if (this.totalSeconds < Clock.MIN_TIME_SECONDS) {
            this._seconds = Clock.MIN_TIME_SECONDS;
        }
    }

    start() {
        if (!this.#intervalID) {
            this.#intervalID = setInterval(() => {
                // when clock pass the max, The clock return back to zero with modulo.
                this._seconds = (this._seconds + 1) % (Clock.MAX_TIME_SECONDS + 1);
            }, 1000);
        }
    }

    pause() {
        clearInterval(this.#intervalID);
        this.#intervalID = null;
    }
}

module.exports = Clock;