const { Link } = await dc.require('RESOURCES/Datacore/Link.jsx');
const { nextRecurrence } = await dc.require("RESOURCES/Datacore/DateUtil.js");

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
    
    return <small style={{ color: diff <= 1 ? 'var(--text-error)' : 'var(--text-muted)', float: 'right' }}>
        <dc.Icon icon="flag" className="icon" /> {days}
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
        const file = app.vault.getAbstractFileByPath(page.$path);
        const process = async () => {
            await app.fileManager.processFrontMatter(file, (frontmatter) => {
                if (frontmatter['repeats']) {
                    ['scheduled', 'deadline'].forEach(propName => {
                        if (frontmatter[propName]) {
                            frontmatter[propName] = nextRecurrence(frontmatter[propName], frontmatter['repeats']).toFormat('y-MM-dd');
                        }
                    });
                    if (frontmatter['remind on']) {
                        frontmatter['remind on'] = nextRecurrence(frontmatter['remind on'], frontmatter['repeats']).toFormat("y-MM-dd'T'T");
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

    return <a onClick={handleClick} style={{ marginRight: '8px' }}>
        <dc.Icon icon={icon} className="task-icon" />
        {page.$frontmatter?.closed && (
            page.$frontmatter?.closed?.value.toFormat('MMM d')
        )}
    </a>;
}

const Task = ({ page }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox page={page} />
            <Link path={page.$path}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <span>{page.$name}</span>
                    <small style={{ color: 'var(--text-muted)' }}>{page.$path.split('/').at(-2)}</small>
                </div>
                {(!page.$frontmatter?.closed && page.$frontmatter?.deadline) && (
                    <div style={{ marginLeft: 'auto' }}>
                        <Deadline deadline={page.$frontmatter?.deadline} />
                    </div>
                )}
            </Link>
        </div>
    );
};



return { Task };