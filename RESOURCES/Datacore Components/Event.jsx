const { Link } = await dc.require('RESOURCES/Datacore Components/Link.jsx');
const today = dc.luxon.DateTime.now().startOf('day');

const Time = ({ start, end }) => {
    let startTime = start?.toFormat('t');
    let endTime = end?.toFormat('t');

    if (+start == start?.startOf('day') && !end) {
        return;
    }
    if (!end || +end == end?.startOf('day')) {
        return <>{startTime} </>
    }
    return <>{startTime} - {endTime} </>
}

const Event = ({ page }) => {
    const start = page.$frontmatter?.start?.value;
    const end = page.$frontmatter?.end?.value;

    return <small>
        <Time start={start} end={end} />
        <Link path={page.$path}>
            <dc.Icon icon='calendar-days' className="icon-in-link" />
            {page.$name}
        </Link>
    </small>
};

return { Event };