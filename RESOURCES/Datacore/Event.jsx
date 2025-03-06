const { Link } = await dc.require('RESOURCES/Datacore/Link.jsx');
const today = dc.luxon.DateTime.now().startOf('day');

const Time = ({ start, end, type = 'time' }) => {
    const startTime = start?.toFormat('t');
    const endTime = end?.toFormat('t');
    
    switch (type) {
        case 'date': {
            if (+start.startOf('day') >= today.plus({ days: -1 })) {
                return;
            }
            return <span style={{ color: 'var(--text-muted)' }}>{start?.toFormat('MMM d')} </span>;
        }
        case 'time':
        default: {
            if (+start == start.startOf('day')) {
                return;
            }
            if (!end) {
                return <span style={{ color: 'var(--text-muted)' }}>{startTime} </span>;
            }
            return <span style={{ color: 'var(--text-muted)' }}>{startTime} - {endTime} </span>;
        };
    }
}

const Event = ({ page, type }) => {
    const start = page.$frontmatter?.start?.value;
    const end = page.$frontmatter?.end?.value;

    return <small style={{ display: 'flex' }}>
        <Link path={page.$path} style={{ flexGrow: 1 }}>
            <Time start={start} end={end} type={type} />
            <dc.Icon icon='calendar-days' className="icon-in-link" />
            {page.$name}
        </Link>
        {page.$frontmatter?.['meeting url']?.value && (
            <a
                target="_blank"
                href={page.$frontmatter['meeting url'].value}
                style={{ float: 'right', textDecorationLine: 'none' }}
            >
                <dc.Icon icon='video' className="icon-in-link" />
                Join meeting
            </a>
        )}
    </small>
};

return { Event };