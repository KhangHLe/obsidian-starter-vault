const { Link } = await dc.require('RESOURCES/Datacore Components/Link.jsx');
const today = dc.luxon.DateTime.now().startOf('day');

const Deadline = ({ deadline }) => {
    const diff = deadline.value.startOf('day').diff(today, 'days').days;
    let days;
    
    if (diff == 0) {
        days = 'Today';
    } else if (diff == 1) {
        days = 'Tomorrow';
    } else if (diff == -1) {
        days = 'Yesterday';
    } else if (diff > 1) {
        days = `${diff} days left`;
    } else if (diff < -1) {
        days = `${Math.abs(diff)} days ago`;
    }
    
    return <small style={{ color: diff <= 1 ? 'darkred' : '', float: 'right' }}>
        <dc.Icon icon="flag" className="icon" /> {days}
    </small>;
}

const Folder = ({ path }) => {
    const split = path.split('/');
    if (split[0] == 'INBOX') {
        return <small style={{ color: 'grey', paddingLeft: '22px' }}>
            <dc.Icon icon='inbox' className="icon" /> Inbox
        </small>
    }
    return <small style={{ color: 'grey', paddingLeft: '20px' }}>
        {split[1]}
    </small>;
}

const Checkbox = ({ page }) => {
    let icon;
    if (!page.$frontmatter?.closed) {
        icon = 'circle';
    } else if (page.$frontmatter?.closed) {
        icon = 'check-circle';
    }

    if (!icon) return;

    const handleClick = dc.useCallback(() => {
        const iconic = app.plugins.getPlugin('iconic');
        let newIcon = 'lucide-circle';
        if (!page.$frontmatter?.closed && !page.$frontmatter?.recurrence) {
            newIcon = 'lucide-check-circle';
        }
        iconic.saveFileIcon(
            { id: page.$path },
            newIcon,
            null,
        );
        iconic.refreshIconManagers();

        const file = app.vault.getAbstractFileByPath(page.$path);
        const process = async () => {
            await app.fileManager.processFrontMatter(file, (frontmatter) => {
                if (frontmatter['recurrence']) {
                    const units = {
                        year: 0,
                        month: 0,
                        week: 0,
                        day: 0
                    };

                    const regex = /(\d+)\s*(year|month|week|day)s?/g;
                    let match;

                    while ((match = regex.exec(frontmatter['recurrence'])) !== null) {
                        const [, value, unit] = match;
                        units[unit] = parseInt(value, 10);
                    }

                    const duration = dc.luxon.Duration.fromObject({
                        years: units.year,
                        months: units.month,
                        weeks: units.week,
                        days: units.day,
                    });
                    
                    if (frontmatter['scheduled']) {
                        frontmatter['scheduled'] = dc.luxon.DateTime.fromISO(frontmatter['scheduled']).plus(duration).toFormat('y-MM-dd');
                    }
                    if (frontmatter['deadline']) {
                        frontmatter['deadline'] = dc.luxon.DateTime.fromISO(frontmatter['deadline']).plus(duration).toFormat('y-MM-dd');
                    }
                } else if (frontmatter['closed']) {
                    delete frontmatter['closed'];
                    frontmatter['tags'] = frontmatter['tags']?.concat('anytime') || ['anytime'];
                } else {
                    frontmatter['closed'] = dc.luxon.DateTime.now().toFormat("y-MM-dd'T'T");
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
        };
        process();
    }, [page]);

    return <a onClick={handleClick}>
        <dc.Icon icon={icon} className="icon-in-link" />
    </a>;
}

const Task = ({ page }) => {
    let deadline;

    if (!page.$frontmatter?.closed) {
        deadline = page.$frontmatter?.deadline;
    }

    return <>
        <Checkbox page={page} />
        <Link path={page.$path}>
            {page.$name}
        </Link>
        {deadline && <Deadline deadline={deadline} />}
        <br/>
        <Folder path={page.$path} />
    </>;
};



return { Task };