// Event.js
const { authenticate } = require("./Auth");

let Events = [
    { id: 1, userId: 1, name: "artExhibition", date: "2025-01-01", time: "12:00:00", category: "Meetings" },
    { id: 2, userId: 2, name: "debate", date: "2025-01-03", time: "13:05:00", category: "Birthdays" }
];

module.exports = function (app) {
    app.get("/events", authenticate, (req, res) => {
        console.log("User from token:", req.user);
        const userEvents = Events.filter(event => event.userId === req.user.id);
        res.json(userEvents);
    });

    app.post("/events", authenticate, (req, res) => {
        const { name, date, time, category } = req.body;

        if (!name || !date || !time || !category) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newEvent = { id: Events.length + 1, userId: req.user.id, name, date, time, category };
        Events.push(newEvent);
        res.status(201).json(newEvent);
    });

    function checkReminder() {
        const now = new Date();

        Events.forEach(event => {
            const eventTime = new Date(`${event.date}T${event.time}`);
            const timeDiff = eventTime - now;

            if (timeDiff > 0 && timeDiff <= 60000) {
                setTimeout(() => {
                    console.log(`Reminder: ${event.name} is happening soon!`);
                }, timeDiff);
            }
        });
    }

    setInterval(checkReminder, 60000);

    app.get("/events/notifications", authenticate, (req, res) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEvents = Events.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= today;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json(upcomingEvents);
    });
};