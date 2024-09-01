const { Task } = await dc.require("RESOURCES/Datacore Components/Task.jsx");
const { Event } = await dc.require("RESOURCES/Datacore Components/Event.jsx");

const Row = ({ page }) => {
    if (page.$frontmatter?.start) {
        return <Event page={page} />;
    } else {
        return <Task page={page} />;
    }
};

return { Row };