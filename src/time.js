module.exports.Time = class Time {
    _seconds;
    static MAX_TIME_SECONDS = 99 * 3600 + 59 * 60 + 59; // 99:59:59
    static MIN_TIME_SECONDS = -(99 * 3600 + 59 * 60 + 59); // -99:59:59

    constructor(time = {}) {
        if (!time.hasOwnProperty('hours')
            && !time.hasOwnProperty('minutes')
            && !time.hasOwnProperty('seconds')) {
            const now = new Date();
            this._seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        } else {
            this._seconds = this.#timeToSeconds(time);
            this.#validateTime();
        }
    }

    #timeToSeconds(time){
        return (time.hours !== undefined ? time.hours * 3600 : 0) +
        (time.minutes !== undefined ? time.minutes * 60 : 0) +
        (time.seconds !== undefined ? time.seconds : 0);
    }

    #validateTime() {
        if (this._seconds > Time.MAX_TIME_SECONDS) {
            this._seconds = Time.MAX_TIME_SECONDS;
        } else if (this._seconds < Time.MIN_TIME_SECONDS) {
            this._seconds = Time.MIN_TIME_SECONDS;
        }
    }

    set seconds(seconds) {
        this._seconds = this.hours * 3600 + this.minutes * 60 + (seconds !== undefined ? seconds : 0);
        this.#validateTime();
    }

    set minutes(minutes) {
        this._seconds = this.hours * 3600 + (minutes !== undefined ? minutes * 60 : 0) + this.seconds;
        this.#validateTime();
    }

    set hours(hours) {
        this._seconds = (hours !== undefined ? hours * 3600 : 0) + this.minutes * 60 + this.seconds;
        this.#validateTime();
    }

    get seconds() {
        const absSeconds = Math.abs(this._seconds % 60);
        const seconds = this._seconds >= 0 ? absSeconds : -absSeconds;

        return seconds === -0 ? 0 : seconds;
    }

    get minutes() {
        const minutes = (this._seconds % 3600) / 60;
        const flooredOrCeiledMinutes = this._seconds >= 0 ? Math.floor(minutes) : Math.ceil(minutes);

        return flooredOrCeiledMinutes === -0 ? 0 : flooredOrCeiledMinutes;
    }

    get hours() {
        const hours = this._seconds / 3600;
        const flooredOrCeiledHours = hours >= 0 ? Math.floor(hours) : Math.ceil(hours);

        return flooredOrCeiledHours === -0 ? 0 : flooredOrCeiledHours;
    }

    get totalSeconds() {
        return this._seconds;
    }

    addSeconds(seconds) {
        this._seconds += seconds;
        this.#validateTime()
    }

    removeSeconds(seconds) {
        this._seconds -= seconds;
        this.#validateTime()
    }

    resetSeconds() {
        this.seconds = 0;
        this.#validateTime()
    }

    addMinutes(minutes) {
        this._seconds += minutes * 60;
        this.#validateTime()
    }

    removeMinutes(minutes) {
        this._seconds -= minutes * 60;
        this.#validateTime()
    }

    resetMinutes() {
        this.minutes = 0;
        this.#validateTime()
    }

    addHours(hours) {
        this._seconds += hours * 3600;
        this.#validateTime()
    }

    removeHours(hours) {
        this._seconds -= hours * 3600;
        this.#validateTime()
    }

    resetHours()
    {
        this.hours = 0;
        this.#validateTime()
    }

    reset() {
        this._seconds = 0;
    }

    addTime(time) {
        this._seconds += this.#timeToSeconds(time);
        this.#validateTime()
    }

    subTime(time) {
        this._seconds -= this.#timeToSeconds(time);
        this.#validateTime()
    }

    toString(format = 'HH:MM:SS') {
        const absoluteSeconds = Math.abs(this._seconds);
        const hours = String(Math.floor(absoluteSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((absoluteSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(absoluteSeconds % 60).padStart(2, '0');

        return (this._seconds >= 0 ? '' : '-')
            + format
                .replace('HH', hours)
                .replace('MM', minutes)
                .replace('SS', seconds);
    }


    greaterThenEqual(time) {
        return this._seconds >= this.#timeToSeconds(time)
    }

    greaterThen(time) {
        return this._seconds > this.#timeToSeconds(time)
    }

    lowerThenEqual(time) {
        return this._seconds <= this.#timeToSeconds(time)
    }

    lowerThen(time) {
        return this._seconds < this.#timeToSeconds(time)
    }
}