// Database connection.
require('dotenv').config();
const cors = require("cors")
const mysql = require('mysql2');
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT
// });

// db.connect(err => {
//     if (err) {
//         console.error('Database connection failed: ', err);
//         return;
//     }
//     console.log('Connected to MySQL database.');
// });




// Express setup.
const express = require('express')
const app = express()
const port = 3001

app.use(express.json(), cors())

app.get('/searchDB', (req, res) => {

    const { phrase } = req.body;
    db.query('SELECT * FROM games WHERE name LIKE ?', [phrase], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
})

app.get('/search', (req, res) => {

    const { phrase } = req.body;
    console.log(req.query);
    const testData = [
        { id: 1, name: 'Catan', minAge: 10, minPlayers: 3, maxPlayers: 4, playTime: '60-120 min' },
        { id: 2, name: 'Carcassonne', minAge: 7, minPlayers: 2, maxPlayers: 5, playTime: '35-45 min' },
        { id: 3, name: 'Ticket to Ride', minAge: 8, minPlayers: 2, maxPlayers: 5, playTime: '30-60 min' },
        { id: 4, name: 'Azul', minAge: 8, minPlayers: 2, maxPlayers: 4, playTime: '30-45 min' },
        { id: 5, name: '7 Wonders', minAge: 10, minPlayers: 3, maxPlayers: 7, playTime: '30 min' }
    ];

    res.json(testData);
})

app.listen(port, () => {
    console.log(`Backend running on port: ${port}`)
})
