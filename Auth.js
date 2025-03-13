// Auth.js
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const SECRET_KEY = "xyz";

app.use(express.json());

const users = [
    { id: 1, username: "ayesha", password: "Xyz123" },
    { id: 2, username: "noOne", password: "dnkc123" },
];

app.post("/login", (req, res) => {
    console.log("Login Attempt:", req.body);
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        console.log("Invalid login attempt for:", username);
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
});

function authenticate(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized - No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }
}

module.exports = { app, authenticate };