const { Link } = await dc.require("RESOURCES/Datacore/Link.jsx");

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
                page.$frontmatter.folgezettel.value.toLowerCase().includes(filter.toLowerCase()) ||
                filter.toLowerCase().startsWith(page.$frontmatter.folgezettel.value);
        })
        .sort(page => [page.$frontmatter.folgezettel], 'asc')
    ), [filter]);

    const columns = [{
        id: '',
        value: (page) => (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Link path={page.$path} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    {page.$name}
                    <small style={{ color: 'var(--text-muted)' }}>{page.$path.split('/').at(-2)}</small>
                </Link>
                <a onClick={() => setFilter(page.$frontmatter?.folgezettel.value)} style={{ fontSize: "smaller", textDecorationLine: 'none' }}>
                    <dc.Icon icon='waypoints' className="icon" /> {page.$frontmatter?.folgezettel.value}
                </a>
            </div>
        )
    }];

    return <>
        <Filter value={filter} onChange={(e) => setFilter(e.target.value)} />
        <dc.VanillaTable columns={columns} rows={pages} paging={15} />
    </>
};

return { Zettelkasten };