const { Task } = await dc.require("RESOURCES/Datacore/Task.jsx");
const { Event } = await dc.require("RESOURCES/Datacore/Event.jsx");
const { nextRecurrence, today } = await dc.require("RESOURCES/Datacore/DateUtil.js");

const handleGroup = (page) => {
    if (page.$frontmatter?.repeats && page.$frontmatter?.start) {
        return nextRecurrence(page.$frontmatter?.start.value, page.$frontmatter?.repeats.value).startOf('day')
    }
    if (page.$frontmatter?.start) {
        return page.$frontmatter?.start?.value.startOf('day');
    }
    return page.$frontmatter?.scheduled?.value ?? page.$frontmatter?.deadline?.value;
};

const Header = ({ group }) => {
    const date = dc.luxon.DateTime.fromISO(group.key);
    let header = date.toFormat("EEEE");
    if (+date == +today) {
        header = 'Today';
    } else if (+date == +today.plus({ days: 1 })) {
        header = 'Tomorrow'
    }

    return <>
        <big style={{ fontSize: '30px' }}>{date.day}</big>
        <small style={{ color: 'grey' }}> {header}</small>
    </>;
};

const handlePages = (pages) => (pages
    .where(page => {
        if (page.$frontmatter?.repeats && page.$frontmatter?.start) {
            const next = nextRecurrence(page.$frontmatter?.start.value, page.$frontmatter?.repeats.value).startOf('day');
            return next > +today && next <= today.plus({ days: 7 });
        }

        return true;
    })
    .sort(page => page.$frontmatter?.start ? 1 : 2)
    .groupBy(handleGroup)
    .sort(group => group.key)
);

const Upcoming = () => {
    const query = dc.useQuery(`@page 
        AND !path(RESOURCES) 
        AND (
            (!closed AND (
                (striptime(scheduled) > date(today) AND striptime(scheduled) <= date(today) + dur(7 days)) 
                OR (!scheduled AND (deadline > date(today) AND deadline <= date(today) + dur(7 days)))
            ))
            OR (striptime(start) > date(today) AND striptime(start) <= date(today) + dur(7 days))
            OR (repeats AND start)
        )`);
    const pages = dc.useArray(query, handlePages);

    return pages.map(group => {
        const columns = [{
            id: <Header group={group} />,
            value: (page) => {
                if (page.$frontmatter?.start) {
                    return <Event page={page} type='time' />;
                } else {
                    return <Task page={page} />;
                }
            },
        }];

        return <dc.Stack>
            <dc.VanillaTable columns={columns} rows={group.rows} />
        </dc.Stack>;
    });
};

return { Upcoming }