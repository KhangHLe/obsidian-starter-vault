const { Row } = await dc.require('RESOURCES/Datacore Components/Row.jsx');

const handleGroup = (page) => {
    if (page.$frontmatter.start) {
        return page.$frontmatter?.start?.value.startOf('day');
    }
    return page.$frontmatter?.scheduled?.value ?? page.$frontmatter?.deadline?.value;
};

const Header = ({ group }) => {
    const today = dc.luxon.DateTime.now().startOf('day');
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
    .sort(page => page.$frontmatter?.start ? 1 : 2)
    .groupBy(handleGroup)
    .sort(group => group.key)
);

const Upcoming = () => {
    const query = dc.useQuery(`@page 
        AND !path(RESOURCES) 
        AND (
            (!closed AND (
                (scheduled > date(today) AND scheduled <= date(today) + dur(7 days)) 
                OR (!scheduled AND (deadline > date(today) AND deadline <= date(today) + dur(7 days)))
            ))
            OR (striptime(start) > date(today) AND striptime(start) <= date(today) + dur(7 days))
        )`);
    const pages = dc.useArray(query, handlePages);

    return pages.map(group => {
        const columns = [{
            id: <Header group={group} />,
            value: (page) => <Row page={page} />,
        }];

        return <>
            <dc.VanillaTable columns={columns} rows={group.rows} />
            <br/>
        </>;
    });
};

return { Upcoming }