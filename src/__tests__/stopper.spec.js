const {Stopper} = require('..//stopper');

describe('Stopper class', () => {

    test("inheritance tests", () => {
        const stopper = new Stopper(false);
        expect(stopper.toString()).toBe("00:00:00");

        stopper.seconds = 5;
        expect(stopper.seconds).toEqual(5);

        stopper.minutes = 5;
        expect(stopper.minutes).toEqual(5);

        stopper.hours = 5;
        expect(stopper.hours).toEqual(5);

        expect(stopper.totalSeconds).toEqual(18305);

        stopper.addSeconds(1);
        expect(stopper.seconds).toEqual(6);

        stopper.addMinutes(1);
        expect(stopper.minutes).toEqual(6);

        stopper.addHours(1);
        expect(stopper.hours).toEqual(6);

        stopper.removeSeconds(1);
        expect(stopper.seconds).toEqual(5);

        stopper.removeMinutes(1);
        expect(stopper.minutes).toEqual(5);

        stopper.removeHours(1);
        expect(stopper.hours).toEqual(5);

        stopper.resetSeconds();
        expect(stopper.seconds).toEqual(0);

        stopper.resetMinutes(1);
        expect(stopper.minutes).toEqual(0);

        stopper.resetHours(1);
        expect(stopper.hours).toEqual(0);

        stopper.addTime({hours: 1, minutes: 1, seconds: 1});
        expect(stopper.toString()).toBe("01:01:01");

        stopper.subTime({hours: 0, minutes: 0, seconds: 31});
        expect(stopper.toString()).toBe("01:00:30");

        stopper.reset()
        expect(stopper.totalSeconds).toEqual(0);

        let result = stopper.greaterThen({hours: 1, minutes: 0, seconds: 0});
        expect(result).toBeFalsy();

        result = stopper.greaterThenEqual({hours: 0, minutes: 0, seconds: 0});
        expect(result).toBeTruthy();

        result = stopper.lowerThenEqual({hours: 0, minutes: 0, seconds: 0});
        expect(result).toBeTruthy();

        result = stopper.lowerThen({hours: 1, minutes: 1, seconds: 1});
        expect(result).toBeTruthy();
    });

    describe('stopper class tests', () => {
        beforeAll(() => {
            jest.useFakeTimers(); // שימוש בטיימרים פיקטיביים
        });

        afterEach(() => {
            jest.clearAllTimers(); // ניקוי כל הטיימרים לאחר כל טסט
        });

        test.each([
            [false, "00:00:00", 3000],
            [true, "00:00:03", 3000],
            [true, "00:00:30", 30000],
        ])("ctor start = 00:00:00, auto start = %s, expectedTime = %s, delay = %s", (autoStart, expectedTime, milliseconds) => {

            const stopper = new Stopper(autoStart);
            jest.advanceTimersByTime(milliseconds);
            expect(stopper.toString()).toBe(expectedTime);
        });

        test.each([
            [false, "00:00:03", 3000],
            [true, "00:00:30", 30000],

        ])("start method : start = 00:00:00, auto start = %s, expectedTime = %s, delay = %s", (autoStart, expectedTime, milliseconds) => {

            const stopper = new Stopper(autoStart);
            stopper.start();
            jest.advanceTimersByTime(milliseconds);
            expect(stopper.toString()).toBe(expectedTime);
        });

        test.each([
            [false, "00:00:03", 3000],
            [true, "00:00:30", 30000],
        ])("pause method: auto start = %s, expectedTime = %s, delay = %s", (autoStart, expectedTime, milliseconds) => {

            const stopper = new  Stopper(autoStart);
            stopper.start();
            jest.advanceTimersByTime(milliseconds);
            stopper.pause();
            jest.advanceTimersByTime(milliseconds);
            expect(stopper.toString()).toBe(expectedTime);
        });

        test.each([
            [false, "00:00:03", 3000],
            [false, "00:00:30", 30000],
            [false, "00:05:24", 324000],

        ])("reset method :  auto start = %s, expectedTime = %s, delay = %s", (autoStart, expectedTime1, milliseconds) => {

            const stopper = new  Stopper(autoStart);
            stopper.start();
            jest.advanceTimersByTime(milliseconds);
            expect(stopper.toString()).toBe(expectedTime1);
            stopper.reset();
            expect(stopper.toString()).toBe("00:00:00");
        });

        test.each([
            [false, "00:00:03", 3000],
            [false, "00:00:30", 30000],
            [false, "00:05:24", 324000],

        ])("stop method :  auto start = %s, expectedTime = %s, delay = %s", (autoStart, expectedTime1, milliseconds) => {

            const stopper = new  Stopper(autoStart);
            stopper.start();
            jest.advanceTimersByTime(milliseconds);
            expect(stopper.toString()).toBe(expectedTime1);
            stopper.stop();
            expect(stopper.toString()).toBe(expectedTime1);
            stopper.start();
            expect(stopper.toString()).toBe("00:00:00");
        });
    });
})