const { Link } = await dc.require('RESOURCES/Datacore Components/Link.jsx');
const { Folder } = await dc.require("RESOURCES/Datacore Components/Folder.jsx");
const { nextRecurrence } = await dc.require("RESOURCES/Datacore Components/DateUtil.js");

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
    
    return <small style={{ color: diff <= 1 && 'var(--text-error)', float: 'right' }}>
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
        <dc.Icon icon={icon} className="icon-in-link" />
        {page.$frontmatter?.closed && (
            page.$frontmatter?.closed?.value.toFormat('MMM d')
        )}
    </a>;
}

const Task = ({ page }) => {
    let deadline;

    if (!page.$frontmatter?.closed) {
        deadline = page.$frontmatter?.deadline;
    }

    return <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'  }}>
        <div>
            <Checkbox page={page} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link path={page.$path}>
                {page.$name}
            </Link>
            <Folder path={page.$path} />
        </div>
        {deadline && (
            <div style={{ marginLeft: 'auto' }}>
                <Deadline deadline={deadline} />
            </div>
        )}
    </div>;
};



return { Task };