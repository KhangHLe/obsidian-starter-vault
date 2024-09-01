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
    const allPages = dc.useArray(query, (array) => array
        .sort(page => [page.$frontmatter.folgezettel], 'asc')
    );

    const filteredPages = dc.useMemo(() => (
        allPages.filter(page => {
            if (filter == '') return true;
            return page.$name.toLowerCase().includes(filter.toLowerCase()) ||
                page.$frontmatter.folgezettel.value.toLowerCase().includes(filter.toLowerCase());
        })
    ), [allPages, filter])

    const columns = [
        { id: '', value: (page) => page.$frontmatter?.folgezettel.value },
        { id: '', value: (page) => page.$link }
    ];

    return <>
        <Filter value={filter} onChange={(e) => setFilter(e.target.value)} />
        <dc.VanillaTable columns={columns} rows={filteredPages} paging={15} />
    </>
};

return { Zettelkasten };