const DateTime = dc.luxon.DateTime;
const today = DateTime.now().startOf('day');

const nextRecurrence = (start, repeats) => {
    let startDate = DateTime.fromISO(start);
    const split = repeats.split(' ');
    const units = {
        year: 0,
        month: 0,
        week: 0,
        day: 0
    };

    ['day', 'week', 'month', 'year'].forEach(unit => {
        if (split[2].startsWith(unit)) {
            units[unit] = split[1];
        }
    });

    const duration = dc.luxon.Duration.fromObject({
        years: units.year,
        months: units.month,
        weeks: units.week,
        days: units.day,
    });

    while (+startDate < +today) {
        startDate = startDate.plus(duration);
    }

    return startDate;
};

return { nextRecurrence, today };