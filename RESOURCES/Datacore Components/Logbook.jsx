const { Row } = await dc.require('RESOURCES/Datacore Components/Row.jsx');

const handleGroup = (page) => {
    if (page.$frontmatter?.closed) {
        return page.$frontmatter?.closed?.value.startOf('day');
    }
    return page.$frontmatter?.end?.value.startOf('day') ?? page.$frontmatter?.start?.value.startOf('day');
};

const handlePages = (pages) => (pages
    .sort(page => page.$frontmatter?.closed ?? page.$frontmatter?.start, 'desc')
    .limit(50)
    .groupBy(handleGroup)
    .sort(group => group.key, 'desc')
);

const Header = ({ group }) => {
    const today = dc.luxon.DateTime.now().startOf('day');
    const date = group.key;
    let day = date?.toFormat('EEEE');
    
    if (+date == +today) day = 'Today';
    else if (+date == +today.plus({ days: -1 })) day = 'Yesterday';

    return <>
        {date.toFormat('MMMM d')}
        <small style={{ color: 'grey' }}> {day}</small>
    </>;
};

const Logbook = () => {
    const query = dc.useQuery(`@page 
        AND !path(RESOURCES) 
        AND (closed OR (
            (end AND end < date(today)) 
            OR (start < date(today))
        ))`);
    const groups = dc.useArray(query, handlePages);

    return groups.map(group => {
        const columns = [{ id: <Header group={group} />, value: (page) => <Row page={page} /> }];

        return <>
            <dc.VanillaTable columns={columns} rows={group.rows} />
            <br/>
        </>;
    });
};

return { Logbook };