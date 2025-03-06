const { Task } = await dc.require("RESOURCES/Datacore/Task.jsx");
const { Event } = await dc.require("RESOURCES/Datacore/Event.jsx");

const today = dc.luxon.DateTime.now().startOf('day');

const handleGroup = (page) => {
    if (page.$frontmatter?.closed) {
        if (+page.$frontmatter?.closed?.value.startOf('day') == +today || +page.$frontmatter?.closed?.value.startOf('day') == +today.plus({ days: -1 })) {
            return page.$frontmatter?.closed?.value.startOf('day');
        }
        return page.$frontmatter?.closed?.value.startOf('month');
    }
    if (page.$frontmatter?.start) {
        const eventDate = page.$frontmatter?.end ?? page.$frontmatter?.start;
        if (eventDate?.value.startOf('day') == +today || eventDate?.value.startOf('day') == +today.plus({ days: -1 })) {
            return eventDate?.value?.startOf('day');
        }
        return eventDate?.value?.startOf('month');
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
    const date = group.key;

    if (+date == +today) return 'Today';
    else if (+date == +today.plus({ days: -1 })) return 'Yesterday';

    return date.toFormat('MMMM');
};

const Logbook = () => {
    const query = dc.useQuery(`@page 
        AND !path(RESOURCES) 
        AND !repeats 
        AND (closed OR start < date(today))`);
    const groups = dc.useArray(query, handlePages);

    return groups.map(group => {
        const columns = [{
            id: <Header group={group} />,
            value: (page) => {
                if (page.$frontmatter?.start) {
                    return <Event page={page} type='date' />;
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

return { Logbook };