const Link = ({ path, children, style }) => (
    <a target="_blank"
        rel="noopener"
        data-tooltip-position="top"
        data-href={path}
        class="internal-link"
        style={{ ...style, textDecorationLine: 'none' }}>
        {children}
    </a>
);

return { Link };