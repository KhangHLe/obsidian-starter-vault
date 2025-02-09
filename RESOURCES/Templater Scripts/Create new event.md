<%*
const iconic = app.plugins.getPlugin('iconic');
iconic.saveFileIcon(
    { id: tp.file.path(true) },
    'lucide-calendar-days',
    null,
);
iconic.fileIconManager.refreshIcons();

tp.hooks.on_all_templates_executed(async () => {
    const file = tp.file.find_tfile(tp.file.path(true));
    await app.fileManager.processFrontMatter(file, (frontmatter) => {
        frontmatter['start'] = '';
        frontmatter['end'] = '';
        return frontmatter;
    });
});
_%>
