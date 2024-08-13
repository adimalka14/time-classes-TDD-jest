const {Clock} = require('../clock');

describe('Clock class', () => {

    test("inheritance tests", () => {
        const clock = new Clock({hours: 0, minutes: 0, seconds: 0}, false);
        expect(clock.toString()).toBe("00:00:00");

        clock.seconds = 5;
        expect(clock.seconds).toEqual(5);

        clock.minutes = 5;
        expect(clock.minutes).toEqual(5);

        clock.hours = 5;
        expect(clock.hours).toEqual(5);

        expect(clock.totalSeconds).toEqual(18305);

        clock.addSeconds(1);
        expect(clock.seconds).toEqual(6);

        clock.addMinutes(1);
        expect(clock.minutes).toEqual(6);

        clock.addHours(1);
        expect(clock.hours).toEqual(6);

        clock.removeSeconds(1);
        expect(clock.seconds).toEqual(5);

        clock.removeMinutes(1);
        expect(clock.minutes).toEqual(5);

        clock.removeHours(1);
        expect(clock.hours).toEqual(5);

        clock.resetSeconds();
        expect(clock.seconds).toEqual(0);

        clock.resetMinutes(1);
        expect(clock.minutes).toEqual(0);

        clock.resetHours(1);
        expect(clock.hours).toEqual(0);

        clock.addTime({hours: 1, minutes: 1, seconds: 1});
        expect(clock.toString()).toBe("01:01:01");

        clock.subTime({hours: 0, minutes: 0, seconds: 31});
        expect(clock.toString()).toBe("01:00:30");

        clock.reset()
        expect(clock.totalSeconds).toEqual(0);

        let result = clock.greaterThen({hours: 1, minutes: 0, seconds: 0});
        expect(result).toBeFalsy();

        result = clock.greaterThenEqual({hours: 0, minutes: 0, seconds: 0});
        expect(result).toBeTruthy();

        result = clock.lowerThenEqual({hours: 0, minutes: 0, seconds: 0});
        expect(result).toBeTruthy();

        result = clock.lowerThen({hours: 1, minutes: 1, seconds: 1});
        expect(result).toBeTruthy();
    });

    describe('Clock class tests', () => {
        beforeAll(() => {
            jest.useFakeTimers(); // שימוש בטיימרים פיקטיביים
        });

        afterEach(() => {
            jest.clearAllTimers(); // ניקוי כל הטיימרים לאחר כל טסט
        });

        test.each([
            [{hours: 1, minutes: 5, seconds: 30}, false, "01:05:30", 3000],
            [{hours: 1, minutes: 5, seconds: 30}, true, "01:05:33", 3000],
            [{hours: 40, minutes: 5, seconds: 30}, true, "00:00:02", 3000],
        ])("ctor time = %s, auto start = %s, expectedTime = %s, delay = %s", (time, autoStart, expectedTime, milliseconds) => {

            const clock = new Clock(time, autoStart);
            jest.advanceTimersByTime(milliseconds);
            expect(clock.toString()).toBe(expectedTime);
        });

        test.each([
            [{hours: 10, minutes: 50, seconds: 35}, false, "10:50:50", 15000],
            [{hours: 1, minutes: 5, seconds: 30}, false, "01:05:33", 3000],
            [{hours: 40, minutes: 5, seconds: 30}, false, "00:00:02", 3000],
        ])("start time = %s, auto start = %s, expectedTime = %s, delay = %s", (time, autoStart, expectedTime, milliseconds) => {

            const clock = new Clock(time, autoStart);
            clock.start();
            jest.advanceTimersByTime(milliseconds);
            expect(clock.toString()).toBe(expectedTime);
        });

        test.each([
            [{hours: 10, minutes: 50, seconds: 35}, false, "10:50:50", 15000],
            [{hours: 1, minutes: 5, seconds: 30}, false, "01:05:33", 3000],
            [{hours: 40, minutes: 5, seconds: 30}, false, "00:00:02", 3000],
        ])("start time = %s, auto start = %s, expectedTime = %s, delay = %s", (time, autoStart, expectedTime, milliseconds) => {

            const clock = new Clock(time, autoStart);
            clock.start();
            jest.advanceTimersByTime(milliseconds);
            clock.pause();
            jest.advanceTimersByTime(milliseconds);
            expect(clock.toString()).toBe(expectedTime);
        });

    });
})