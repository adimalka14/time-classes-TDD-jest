class Time {
    _seconds;
    static MAX_TIME_SECONDS = 60 * 60 * 100 - 1; // 23:59:59
    static MIN_TIME_SECONDS = -(60 * 60 * 100 - 1); // -99:59:59

    constructor(time = {}) {
        if (!time.hasOwnProperty('hours')
            && !time.hasOwnProperty('minutes')
            && !time.hasOwnProperty('seconds')) {
            const now = new Date();
            time = {hours: now.getHours(), minutes: now.getMinutes(), seconds: now.getSeconds()};
        }

        this._seconds = Time.#timeToSeconds(time);
        this.#validateAndUpdateTime();
    }

    static #ConvertTotalSecondsToSeconds(totalSeconds) {
        return totalSeconds >= 0 ?
            Math.floor(totalSeconds % 60) :
            Math.ceil(totalSeconds % 60)
    }

    static #ConvertTotalSecondsToMinutes(totalSeconds) {
        return totalSeconds >= 0 ?
            Math.floor((totalSeconds % 3600) / 60) :
            Math.ceil((totalSeconds % 3600) / 60)
    }

    static #ConvertTotalSecondsToHours(totalSeconds) {
        return totalSeconds >= 0 ?
            Math.floor(totalSeconds / 3600) :
            Math.ceil(totalSeconds / 3600)
    }

    static #ConvertHoursToSeconds(hours) {
        return hours * 3600;
    }

    static #ConvertMinutesToSeconds(hours) {
        return hours * 60;
    }

    static #timeToSeconds(time) {
        return (time.hours !== undefined ? Time.#ConvertHoursToSeconds(time.hours) : 0) +
            (time.minutes !== undefined ? Time.#ConvertMinutesToSeconds(time.minutes) : 0) +
            (time.seconds !== undefined ? time.seconds : 0);
    }

    #validateAndUpdateTime() {
        if (this._seconds > Time.MAX_TIME_SECONDS) {
            this._seconds = Time.MAX_TIME_SECONDS;
        } else if (this._seconds < Time.MIN_TIME_SECONDS) {
            this._seconds = Time.MIN_TIME_SECONDS;
        }
    }

    set seconds(seconds) {
        this._seconds = Time.#timeToSeconds({
            hours: this.hours,
            minutes: this.minutes,
            seconds: seconds
        });
        this.#validateAndUpdateTime();
    }

    set minutes(minutes) {
        this._seconds = Time.#timeToSeconds({
            hours: this.hours,
            minutes: minutes,
            seconds: this.seconds
        });
        this.#validateAndUpdateTime();
    }

    set hours(hours) {
        this._seconds = Time.#timeToSeconds({
            hours: hours,
            minutes: this.minutes,
            seconds: this.seconds
        });
        this.#validateAndUpdateTime();
    }

    get seconds() {
        const seconds = Time.#ConvertTotalSecondsToSeconds(this._seconds);

        return seconds ? seconds : 0; // handle the -0 bug from modulo
    }

    get minutes() {
        const minutes = Time.#ConvertTotalSecondsToMinutes(this._seconds);

        return minutes ? minutes : 0;
    }

    get hours() {
        const hours = Time.#ConvertTotalSecondsToHours(this._seconds);

        return hours ? hours : 0;
    }

    get totalSeconds() {
        return this._seconds;
    }

    addSeconds(seconds) {
        this._seconds += seconds;
        this.#validateAndUpdateTime()
    }

    removeSeconds(seconds) {
        this._seconds -= seconds;
        this.#validateAndUpdateTime()
    }

    resetSeconds() {
        this.seconds = 0;
        this.#validateAndUpdateTime()
    }

    addMinutes(minutes) {
        this._seconds += Time.#ConvertMinutesToSeconds(minutes);
        this.#validateAndUpdateTime()
    }

    removeMinutes(minutes) {
        this._seconds -= Time.#ConvertMinutesToSeconds(minutes);
        this.#validateAndUpdateTime()
    }

    resetMinutes() {
        this.minutes = 0;
        this.#validateAndUpdateTime()
    }

    /**
     * reset to starting time.
     * @param { number } hours
     */
    addHours(hours) {
        this._seconds += Time.#ConvertHoursToSeconds(hours);
        this.#validateAndUpdateTime()
    }

    removeHours(hours) {
        this._seconds -= Time.#ConvertHoursToSeconds(hours);
        this.#validateAndUpdateTime()
    }

    resetHours() {
        this.hours = 0;
        this.#validateAndUpdateTime()
    }

    reset() {
        this._seconds = 0;
    }

    addTime(time) {
        this._seconds += Time.#timeToSeconds(time);
        this.#validateAndUpdateTime()
    }

    subTime(time) {
        this._seconds -= Time.#timeToSeconds(time);
        this.#validateAndUpdateTime()
    }

    toString(format = 'HH:MM:SS') {
        const absoluteSeconds = Math.abs(this._seconds);
        const [hours, minutes, seconds] = [
            String(Time.#ConvertTotalSecondsToHours(absoluteSeconds)).padStart(2, '0'),
            String(Time.#ConvertTotalSecondsToMinutes(absoluteSeconds)).padStart(2, '0'),
            String(Time.#ConvertTotalSecondsToSeconds(absoluteSeconds)).padStart(2, '0'),
        ]

        return (this._seconds >= 0 ? '' : '-')
            + format
                .replace('HH', hours)
                .replace('MM', minutes)
                .replace('SS', seconds);
    }


    greaterThenEqual(time) {
        return this._seconds >= Time.#timeToSeconds(time)
    }

    greaterThen(time) {
        return this._seconds > Time.#timeToSeconds(time)
    }

    lowerThenEqual(time) {
        return this._seconds <= Time.#timeToSeconds(time)
    }

    lowerThen(time) {
        return this._seconds < Time.#timeToSeconds(time)
    }
}

module.exports = Time;