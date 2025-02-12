const { Link } = await dc.require("RESOURCES/Datacore Components/Link.jsx");
const { Folder } = await dc.require("RESOURCES/Datacore Components/Folder.jsx");

const Filter = ({ value, onChange }) => {
    return <div class="search-row"> 
        <div class="search-input-container global-search-input-container">
            <input enterkeyhint="search" type="search" spellcheck="false" placeholder="Search..." value={value} onchange={onChange} />
        </div>
    </div>
}

const Zettelkasten = () => {
    const query = dc.useQuery('@page AND folgezettel');
    const [filter, setFilter] = dc.useState('');
    const pages = dc.useArray(query, (array) => (array
        .where(page => {
            if (filter == '') return true;
            return page.$name.toLowerCase().includes(filter.toLowerCase()) ||
                page.$frontmatter.folgezettel.value.toLowerCase().includes(filter.toLowerCase());
        })
        .sort(page => [page.$frontmatter.folgezettel], 'asc')
    ), [filter]);

    const columns = [{
        id: '',
        value: (page) => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                    <Link path={page.$path}>
                        {page.$name}
                    </Link>
                    <small style={{ float: "right", color: 'var(--text-muted)' }}>
                        <dc.Icon icon='waypoints' className="icon" /> {page.$frontmatter?.folgezettel.value}
                    </small>
                </div>
                <Folder path={page.$path} noPadding />
            </div>
        )
    }];

    return <>
        <Filter value={filter} onChange={(e) => setFilter(e.target.value)} />
        <dc.VanillaTable columns={columns} rows={pages} paging={15} />
    </>
};

return { Zettelkasten };