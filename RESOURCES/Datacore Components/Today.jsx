const { Row } = await dc.require('RESOURCES/Datacore Components/Row.jsx');

const handleGroup = (page) => {
    if (page.$tags.includes('#evening')) {
        return 'This Evening';
    }
    return 'Today';
}

const Header = ({ group }) => {
    if (group.key == 'Today') return;
    return <><dc.Icon icon="moon" className="icon" /> This Evening</>
}

const handlePages = (pages) => (pages
    .sort(page => page.$frontmatter?.start ? 1 : 2)
    .groupBy(handleGroup)
    .sort(group => group.key == 'Today' ? 1 : 2)
);

const Today = () => {
    const query = dc.useQuery(`@page 
        AND !path(RESOURCES) 
        AND (
            (!closed AND (scheduled <= date(today) OR deadline = date(today))) 
            OR (
                (!end AND striptime(start) = striptime(date(today))) 
                OR (end AND striptime(start) <= date(today) AND end >= date(today))
            )
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

return { Today };