const { Task } = await dc.require('RESOURCES/Datacore Components/Task.jsx');

const Anytime = () => {
    const pages = dc.useQuery(`@page 
        AND !path(RESOURCES) 
        AND !closed AND (#anytime OR scheduled <= date(today))`);

    const columns = [{ id: '', value: (page) => <Task page={page} /> }];

    return <dc.VanillaTable columns={columns} rows={pages} />;
};

return { Anytime };