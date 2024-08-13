const {CountDown} = require('../countDown');

describe('CountDown class', () => {

    test("inheritance tests", () => {
        const countDown = new CountDown({seconds: 1});
        expect(countDown.toString()).toBe("00:00:01");

        countDown.seconds = 5;
        expect(countDown.seconds).toEqual(5);

        countDown.minutes = 5;
        expect(countDown.minutes).toEqual(5);

        countDown.hours = 5;
        expect(countDown.hours).toEqual(5);

        expect(countDown.totalSeconds).toEqual(18305);

        countDown.addSeconds(1);
        expect(countDown.seconds).toEqual(6);

        countDown.addMinutes(1);
        expect(countDown.minutes).toEqual(6);

        countDown.addHours(1);
        expect(countDown.hours).toEqual(6);

        countDown.removeSeconds(1);
        expect(countDown.seconds).toEqual(5);

        countDown.removeMinutes(1);
        expect(countDown.minutes).toEqual(5);

        countDown.removeHours(1);
        expect(countDown.hours).toEqual(5);

        countDown.resetSeconds();
        expect(countDown.seconds).toEqual(0);

        countDown.resetMinutes(1);
        expect(countDown.minutes).toEqual(0);

        countDown.resetHours(1);
        expect(countDown.hours).toEqual(0);

        countDown.addTime({hours: 1, minutes: 1, seconds: 1});
        expect(countDown.toString()).toBe("01:01:01");

        countDown.subTime({hours: 0, minutes: 0, seconds: 31});
        expect(countDown.toString()).toBe("01:00:30");

        countDown.reset()
        expect(countDown.totalSeconds).toEqual(1);

        let result = countDown.greaterThen({hours: 1, minutes: 0, seconds: 0});
        expect(result).toBeFalsy();

        result = countDown.greaterThenEqual({hours: 0, minutes: 0, seconds: 0});
        expect(result).toBeTruthy();

        result = countDown.lowerThenEqual({hours: 0, minutes: 0, seconds: 1});
        expect(result).toBeTruthy();

        result = countDown.lowerThen({hours: 1, minutes: 1, seconds: 1});
        expect(result).toBeTruthy();
    });

    describe('CountDown class tests', () => {
        beforeAll(() => {
            jest.useFakeTimers(); // שימוש בטיימרים פיקטיביים
        });

        afterEach(() => {
            jest.clearAllTimers(); // ניקוי כל הטיימרים לאחר כל טסט
        });

        test.each([
            [{hours: 1}, "01:00:00"],
            [{minutes: 1}, "00:01:00"],
            [{seconds: 1}, "00:00:01"],
            [{hours: 1, minutes: 1, seconds: 1}, "01:01:01"],
            [{hours: -1, minutes: 0, seconds: 0}, "00:00:00"],
            [{hours: 100, minutes: 0, seconds: 0}, "99:59:59"],
            [{}, "Time must be specified"],
        ])("ctor start = 00:00:00, auto start = %s, expectedTime = %s, delay = %s", (time, expectedTime) => {
            try {
                const countDown = new CountDown(time);
                expect(countDown.toString()).toBe(expectedTime);
            }
            catch (e) {
                expect(e.message).toBe(expectedTime);
            }
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

            const stopper = new Stopper(autoStart);
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

            const stopper = new Stopper(autoStart);
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

            const stopper = new Stopper(autoStart);
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