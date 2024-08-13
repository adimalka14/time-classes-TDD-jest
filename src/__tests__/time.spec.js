const Time = require('../time')

describe('Time class', () => {
    test.each([
        [{minutes: 1, seconds: 30}, '00:01:30'],
        [{hours: 1, minutes: 5, seconds: 30}, '01:05:30'],
        [{hours: -100, minutes: 0, seconds: 0}, '-99:59:59'],
        [undefined, `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}:${new Date().getSeconds().toString().padStart(2, '0')}`]
    ])("constructor tests - for good cases %s %s", (timer, expectedResult) => {
        const time = new Time(timer);
        const result = time.toString();

        expect(result).toBe(expectedResult);
    });

    describe('seconds methods', () => {
        test.each([
            [5, 5],
            [60, 0],
            [0, 0],
            [75, 15]
        ])("set method = for good cases %s %s", (seconds, expectedResult) => {
            const time = new Time({seconds: 30});
            time.seconds = seconds;

            expect(time.seconds).toBe(expectedResult);
        });

        test.each([
            [5, 5],
            [60, 0],
            [0, 0],
            [75, 15]
        ])("get method = for good cases %s %s", (seconds, expectedResult) => {
            const time = new Time({seconds: seconds});

            expect(time.seconds).toBe(expectedResult);
        });

        test.each([
            [5, 45],
            [60, 40],
            [0, 40],
            [75, 55]
        ])("add seconds = for good cases %s", (seconds, expectedResult) => {
            const time = new Time({seconds: 40});
            time.addSeconds(seconds);

            expect(time.seconds).toBe(expectedResult);
        });

        test.each([
            [5, 35],
            [60, -20],
            [0, 40],
            [365000, -59]
        ])("remove seconds = for good cases %s %s", (seconds, expectedResult) => {
            const time = new Time({seconds: 40});
            time.removeSeconds(seconds);

            expect(time.seconds).toBe(expectedResult);
        });

        test.each([
            [{hours: 4, minutes: 5, seconds: 55}],
            [{}, 0],
            [{hours: -12, minutes: 54, seconds: 17}],// "-11:05:43"
            [{hours: -100, minutes: 0, seconds: 0}]
        ])("rest seconds: for good cases %s", (timeObj) => {
            const time = new Time(timeObj);
            time.resetSeconds()

            expect(time.seconds).toBe(0);
        });

    })

    describe('minutes methods', () => {

        test.each([
            [5, 5],
            [60, 0],
            [0, 0],
            [75, 15]
        ])("set min = for good cases %s %s", (min, expectedResult) => {
            const time = new Time({minutes: 30});
            time.minutes = min;

            expect(time.minutes).toBe(expectedResult);
        });

        test.each([
            [5, 5],
            [60, 0],
            [0, 0],
            [75, 15]
        ])("get min = for good cases %s %s", (min, expectedResult) => {
            const time = new Time({minutes: min});

            expect(time.minutes).toBe(expectedResult);
        });

        test.each([
            [5, 45],
            [60, 40],
            [0, 40],
            [75, 55]
        ])("add minutes = for good cases %s", (minutes, expectedResult) => {
            const time = new Time({minutes: 40});
            time.addMinutes(minutes);

            expect(time.minutes).toBe(expectedResult);
        });

        test.each([
            [5, 35],
            [60, -20],
            [0, 40],
            [365000, -59]
        ])("remove minutes = for good cases %s %s", (minutes, expectedResult) => {
            const time = new Time({minutes: 40});
            time.removeMinutes(minutes);

            expect(time.minutes).toBe(expectedResult);
        });

        test.each([
            [{hours: 4, minutes: 5, seconds: 55}],
            [{}, 0],
            [{hours: -12, minutes: 54, seconds: 17}],
            [{hours: -100, minutes: 0, seconds: 0}]
        ])("rest minutes = for good cases %s %s", (timeObj) => {
            const time = new Time(timeObj);
            time.resetMinutes();

            expect(time.minutes).toBe(0);
        });

    })

    describe('hours methods', () => {

        test.each([
            [5, 5],
            [700, 99],
            [0, 0],
            [-700, -99]
        ])("set hours = for good cases %s %s", (hours, expectedResult) => {
            const time = new Time({hours: 30});
            time.hours = hours;

            expect(time.hours).toBe(expectedResult);
        });

        test.each([
            [5, 5],
            [700, 99],
            [0, 0],
            [-700, -99]
        ])("get hours = for good cases %s %s", (hours, expectedResult) => {
            const time = new Time({hours: hours});

            expect(time.hours).toBe(expectedResult);
        });

        test.each([
            [5, 45],
            [700, 99],
            [0, 40],
            [-700, -99]
        ])("add hours = for good cases %s", (hours, expectedResult) => {
            const time = new Time({hours: 40});
            time.addHours(hours);

            expect(time.hours).toBe(expectedResult);
        });

        test.each([
            [5, 35],
            [60, -20],
            [0, 40],
            [365000, -99]
        ])("remove hours = for good cases %s %s", (hours, expectedResult) => {
            const time = new Time({hours: 40});
            time.removeHours(hours);

            expect(time.hours).toBe(expectedResult);
        });

        test.each([
            [{hours: 4, minutes: 5, seconds: 55}],
            [{}, 0],
            [{hours: -12, minutes: 54, seconds: 17}],
            [{hours: -100, minutes: 0, seconds: 0}]
        ])("rest hours = for good cases %s %s", (timeObj) => {
            const time = new Time(timeObj);
            time.resetHours()

            expect(time.hours).toBe(0);
        });

    })

    test.each([
        [{minutes: 1, seconds: 30}],
        [{hours: 1, minutes: 5, seconds: 30}],
        [{hours: -100}],
        [{hours: 100}],
    ])("reset all = for good cases %s", (timer) => {
        const time = new Time(timer);
        time.reset()

        expect(time.totalSeconds).toBe(0);
    });

    test.each([
        [{minutes: 59, seconds: 30}, {hours: 1, minutes: 1, seconds: 30}, "02:01:00"],
        [{hours: 1, minutes: 1, seconds: 30}, {hours: 1, minutes: 1, seconds: 30}, "02:03:00"],
        [{hours: 60, minutes: 1, seconds: 30}, {hours: 50, minutes: 1, seconds: 30}, "99:59:59"],
        [{hours: 1, minutes: 1, seconds: 30}, {hours: -1, minutes: -1, seconds: -30}, "00:00:00"],

    ])("add time = for good cases %s %s %s", (timer1, timer2, expectedResult) => {
        const time = new Time(timer1);
        time.addTime(timer2)

        expect(time.toString()).toBe(expectedResult);
    });

    test.each([
        [{hours: 1, minutes: 1, seconds: 30}, {hours: 107}, "-99:59:59"],
        [{hours: 60, minutes: 1, seconds: 30}, {hours: 50, minutes: 1, seconds: 30}, "10:00:00"],
        [{hours: 1, minutes: 1, seconds: 30}, {hours: 1, minutes: 1, seconds: 30}, "00:00:00"],
        [{hours: 1, minutes: 1, seconds: 30}, {hours: 2}, "-00:58:30"],

    ])("sub time = for good cases %s %s %s", (timer1, timer2, expectedResult) => {
        const time = new Time(timer1);
        time.subTime(timer2)

        expect(time.toString()).toBe(expectedResult);
    });


    test.each([
        [{minutes: 1, seconds: 30}, 90],
        [{hours: 1, minutes: 5, seconds: 30}, 3930],
        [{hours: -100}, -359999],
        [{hours: 100}, 359999],
    ])("total seconds = for good cases %s %s", (timer, expectedResult) => {
        const time = new Time(timer);

        expect(time.totalSeconds).toBe(expectedResult);
    });

    describe('operators', () => {
        test.each([
            [{hours: 1, minutes: 1, seconds: 30}, {hours: 107}, false],
            [{hours: 60, minutes: 1, seconds: 30}, {hours: 50, minutes: 1, seconds: 30}, true],
            [{hours: 1, minutes: 1, seconds: 30}, {hours: 1, minutes: 1, seconds: 30}, true],
            [{hours: -3, minutes: 1, seconds: 30}, {hours: -2}, false],
        ])("greater Then Equal = for good cases %s %s %s", (timer1, timer2, expectedResult) => {
            const time = new Time(timer1);
            const result = time.greaterThenEqual(timer2)

            expect(result).toBe(expectedResult);
        });

        test.each([
            [{hours: 1, minutes: 1, seconds: 30}, {hours: 107}, false],
            [{hours: 60, minutes: 1, seconds: 30}, {hours: 50, minutes: 1, seconds: 30}, true],
            [{hours: 1, minutes: 1, seconds: 30}, {hours: 1, minutes: 1, seconds: 30}, false],
            [{hours: -3, minutes: 1, seconds: 30}, {hours: -2}, false],
        ])("greater Then = for good cases %s %s %s", (timer1, timer2, expectedResult) => {
            const time = new Time(timer1);
            const result = time.greaterThen(timer2)

            expect(result).toBe(expectedResult);
        });

        test.each([
            [{hours: 1, minutes: 1, seconds: 30}, {hours: 107}, true],
            [{hours: 60, minutes: 1, seconds: 30}, {hours: 50, minutes: 1, seconds: 30}, false],
            [{hours: 1, minutes: 1, seconds: 30}, {hours: 1, minutes: 1, seconds: 30}, true],
            [{hours: -3, minutes: 1, seconds: 30}, {hours: -2}, true],
        ])("lower Then equal = for good cases %s %s %s", (timer1, timer2, expectedResult) => {
            const time = new Time(timer1);
            const result = time.lowerThenEqual(timer2)

            expect(result).toBe(expectedResult);
        });

        test.each([
            [{hours: 1, minutes: 1, seconds: 30}, {hours: 107}, true],
            [{hours: 60, minutes: 1, seconds: 30}, {hours: 50, minutes: 1, seconds: 30}, false],
            [{hours: 1, minutes: 1, seconds: 30}, {hours: 1, minutes: 1, seconds: 30}, false],
            [{hours: -3, minutes: 1, seconds: 30}, {hours: -2}, true],
        ])("lower Then = for good cases %s %s %s", (timer1, timer2, expectedResult) => {
            const time = new Time(timer1);
            const result = time.lowerThen(timer2)
            expect(result).toBe(expectedResult);
        });

    })
})