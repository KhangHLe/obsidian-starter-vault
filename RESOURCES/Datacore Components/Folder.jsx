const Folder = ({ path, noPadding }) => {
    const fileExplorerPlugin = app.internalPlugins.getEnabledPluginById("file-explorer");
    const split = path.split('/');
    const folder = app.vault.getAbstractFileByPath(path.match(/^(.+)\/[^\/]+$/)[1]);
    const icon = {
        'INBOX': 'inbox',
        'PROJECTS': 'check-square',
        'AREAS': 'land-plot',
        'RESOURCES': 'library-big',
        'ARCHIVES': 'archive',
    }
    return <a onclick={() => fileExplorerPlugin.revealInFolder(folder)} style={{ fontSize: 'smaller', color: 'var(--text-muted)' }}>
        <dc.Icon icon={icon[split[0]]} className="icon" /> {split[split.length - 2]}
    </a>;
};

return { Folder };