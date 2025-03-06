<%*
tp.hooks.on_all_templates_executed(async () => {
    const file = tp.file.find_tfile(tp.file.path(true));
    await app.fileManager.processFrontMatter(file, (frontmatter) => {
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
        
        return frontmatter;
    });
});
_%>