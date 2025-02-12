<%*
const choices = ['Today', 'This Evening', 'Anytime', 'Scheduled', 'Someday'];
const schedule = await tp.system.suggester(choices, choices);

tp.hooks.on_all_templates_executed(async () => {
    const file = tp.file.find_tfile(tp.file.path(true));
    await app.fileManager.processFrontMatter(file, (frontmatter) => {
        switch (schedule) {
            case 'Today':
                frontmatter['scheduled'] = tp.date.now('YYYY-MM-DD');
                break;
            case 'This Evening':
                frontmatter['tags'] = ['evening'];
                frontmatter['scheduled'] = tp.date.now('YYYY-MM-DD');
                break;
            case 'Anytime':
                frontmatter['tags'] = ['anytime'];
            case 'Scheduled':
                frontmatter['scheduled'] = ''; break;
            case 'Someday':
                frontmatter['tags'] = ['someday'];
                break;
            default: break;
        }
        return frontmatter;
    });
});
_%>