const { Task } = await dc.require("RESOURCES/Datacore Components/Task.jsx");
const { Event } = await dc.require("RESOURCES/Datacore Components/Event.jsx");
const { nextRecurrence, today } = await dc.require("RESOURCES/Datacore Components/DateUtil.js");

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
    .where(page => {
        if (page.$frontmatter?.repeats && page.$frontmatter?.start) {
            return +nextRecurrence(page.$frontmatter?.start.value, page.$frontmatter?.repeats.value).startOf('day') == +today;
        }

        return true;
    })
    .sort(page => page.$frontmatter?.start ? 1 : 2)
    .groupBy(handleGroup)
    .sort(group => group.key == 'Today' ? 1 : 2)
);

const Today = () => {
    const query = dc.useQuery(`@page 
        AND !path(RESOURCES) 
        AND (
            (!closed AND (scheduled <= date(today) OR deadline = date(today))) 
            OR striptime(start) = striptime(date(today))
            OR (
                repeats AND (start OR end)
            )
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

return { Today };