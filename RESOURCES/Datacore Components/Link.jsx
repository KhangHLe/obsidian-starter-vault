const Link = ({ path, children }) => (
    <a target="_blank"
        rel="noopener"
        data-tooltip-position="top"
        data-href={path}
        class="internal-link">
        {children}
    </a>
);

return { Link };