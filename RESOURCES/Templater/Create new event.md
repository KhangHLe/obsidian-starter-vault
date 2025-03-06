<%*
tp.hooks.on_all_templates_executed(async () => {
    const file = tp.file.find_tfile(tp.file.path(true));
    await app.fileManager.processFrontMatter(file, (frontmatter) => {
        frontmatter['start'] = '';
        frontmatter['end'] = '';
        return frontmatter;
    });
});
_%>