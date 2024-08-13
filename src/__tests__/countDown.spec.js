const CountDown = require('../countDown');

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
        ])("constructor :  start = %s, expectedTime = %s",
            (time, expectedTime) => {
                try {
                    const countDown = new CountDown(time);
                    expect(countDown.toString()).toBe(expectedTime);
                } catch (e) {
                    expect(e.message).toBe(expectedTime);
                }
            });

        test.each([
            [{seconds: 6}, "00:00:03", 3000],
            [{minutes: 1}, "00:00:30", 30000],
        ])("start method :time = %s expectedTime = %s, delay = %s",
            (time, expectedTime, milliseconds) => {
                const countDown = new CountDown(time);
                const startingTime = countDown.toString();

                jest.advanceTimersByTime(milliseconds);
                expect(countDown.toString()).toBe(startingTime);

                countDown.start();

                jest.advanceTimersByTime(milliseconds);
                expect(countDown.toString()).toBe(expectedTime);
            });

        test.each([
            [{seconds: 6}, "00:00:03", 3000],
            [{minutes: 1}, "00:00:30", 30000],
        ])("pause method: start = %s, expectedTime = %s delay = %s",
            (time, expectedTime, milliseconds) => {
                const countDown = new CountDown(time);
                const countDownEnd = "00:00:00";

                countDown.start();
                jest.advanceTimersByTime(milliseconds);
                countDown.pause();
                jest.advanceTimersByTime(milliseconds);
                expect(countDown.toString()).toBe(expectedTime);

                countDown.start();
                jest.advanceTimersByTime(milliseconds);
                countDown.pause();
                jest.advanceTimersByTime(milliseconds);
                expect(countDown.toString()).toBe(countDownEnd);
            });

        test.each([
            [{seconds: 3}, "00:00:03", 3000],
            [{seconds: 30}, "00:00:30", 30000],
            [{minutes: 5, seconds: 24}, "00:05:24", 324000],
        ])("reset method :  start = %s, expectedTime = %s, delay = %s",
            (time, expectedTime, milliseconds) => {
                const countDown = new CountDown(time);
                const startingTime = countDown.toString();

                countDown.start();
                jest.advanceTimersByTime(milliseconds);
                expect(countDown.toString()).not.toBe(startingTime);

                countDown.pause();
                countDown.reset();
                jest.advanceTimersByTime(milliseconds);
                expect(countDown.toString()).toBe(expectedTime);
            });

        test.each([
            [{seconds: 3}, 3000],
            [{seconds: 30}, 30000],
            [{minutes: 5, seconds: 24}, 324000],
        ])("stop method :  start = %s, delay = %s",
            (time, milliseconds) => {
                const countDown = new CountDown(time);
                const startingTime = countDown.toString();

                countDown.start();
                jest.advanceTimersByTime(milliseconds);
                expect(countDown.toString()).not.toBe(startingTime);

                const currentTime = countDown.toString();
                countDown.stop();
                jest.advanceTimersByTime(milliseconds);
                expect(countDown.toString()).toBe(currentTime);

                countDown.start();
                expect(countDown.toString()).toBe(startingTime);

                jest.advanceTimersByTime(milliseconds);
                expect(countDown.toString()).not.toBe(startingTime);
            });
    });
})