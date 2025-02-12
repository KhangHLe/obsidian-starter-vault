const { Link } = await dc.require('RESOURCES/Datacore Components/Link.jsx');
const today = dc.luxon.DateTime.now().startOf('day');

const Time = ({ start, end, type = 'time' }) => {
    const startTime = start?.toFormat('t');
    const endTime = end?.toFormat('t');
    
    switch (type) {
        case 'date': {
            if (+start.startOf('day') >= today.plus({ days: -1 })) {
                return;
            }
            return <>{start?.toFormat('MMM d')} </>;
        }
        case 'time':
        default: {
            if (+start == start.startOf('day')) {
                return;
            }
            if (!end) {
                return <>{startTime} </>;
            }
            return <>{startTime} - {endTime} </>;
        };
    }
}

const Event = ({ page, type }) => {
    const start = page.$frontmatter?.start?.value;
    const end = page.$frontmatter?.end?.value;

    return <small>
        <Time start={start} end={end} type={type} />
        <Link path={page.$path}>
            <dc.Icon icon='calendar-days' className="icon-in-link" />
            {page.$name}
        </Link>
        {page.$frontmatter?.['meeting url']?.value && (
            <a
                target="_blank"
                href={page.$frontmatter['meeting url'].value}
                style={{ float: 'right' }}
            >
                <dc.Icon icon='video' className="icon-in-link" />
                Join meeting
            </a>
        )}
    </small>
};

return { Event };