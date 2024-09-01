<%*
const iconic = app.plugins.getPlugin('iconic');
let icon = 'lucide-check-circle';
if (tp.frontmatter['closed'] || tp.frontmatter['recurrence']) {
    icon = 'lucide-circle';
}
iconic.saveFileIcon(
    { id: tp.file.path(true) },
    icon,
    null,
);
iconic.refreshIconManagers();

tp.hooks.on_all_templates_executed(async () => {
    const file = tp.file.find_tfile(tp.file.path(true));
    await app.fileManager.processFrontMatter(file, (frontmatter) => {
        if (frontmatter['recurrence']) {
            const units = {
                year: 0,
                month: 0,
                week: 0,
                day: 0
            };

            // Regular expression to match numbers followed by unit names
            const regex = /(\d+)\s*(year|month|week|day)s?/g;
            let match;

            while ((match = regex.exec(frontmatter['recurrence'])) !== null) {
                const [, value, unit] = match;
                units[unit] = parseInt(value, 10);
            }
            const duration = moment.duration({
                years: units.year,
                months: units.month,
                weeks: units.week,
                days: units.day,
            });
            if (frontmatter['scheduled']) {
                frontmatter['scheduled'] = (moment(frontmatter['scheduled']).add(duration)).format("YYYY-MM-DD");
            }
            if (frontmatter['deadline']) {
                frontmatter['deadline'] = (moment(frontmatter['deadline']).add(duration)).format("YYYY-MM-DD");
            }
            if (frontmatter['start']) {
                frontmatter['start'] = (moment(frontmatter['start']).add(duration)).format("YYYY-MM-DD[T]HH:mm");
            }
            if (frontmatter['end']) {
                frontmatter['end'] = (moment(frontmatter['end']).add(duration)).format("YYYY-MM-DD[T]HH:mm");
            }
        } else if (frontmatter['closed']) {
            delete frontmatter['closed'];
            frontmatter['tags'] = frontmatter['tags']?.concat('anytime') || ['anytime'];
        } else {
            frontmatter['closed'] = tp.date.now('YYYY-MM-DD[T]HH:mm');
            if (frontmatter['tags']) {
                const deleteTags = ['anytime', 'someday', 'evening'];
                frontmatter['tags'] = frontmatter['tags'].filter(x => !deleteTags.includes(x));
                if (frontmatter['tags'].length === 0) {
                    delete frontmatter['tags'];
                }
            }
            delete frontmatter['scheduled'];
            delete frontmatter['deadline'];
        }
        
        return frontmatter;
    });
});
_%>