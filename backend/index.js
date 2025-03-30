// Database connection.
require('dotenv').config();
const cors = require("cors")
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ', err);
        return;
    }
    console.log('Connected to MySQL database.');
});


// Express setup.
const express = require('express')
const app = express()
const port = 3001

app.use(express.json(), cors())

app.get('/search', (req, res) => {
    const { phrase } = req.body;
    db.query('SELECT * FROM games WHERE name LIKE ?', [phrase], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
})

app.listen(port, () => {
    console.log(`Backend running on port: ${port}`)
})
