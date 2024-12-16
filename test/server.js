const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Define a route to render the EJS file
app.get('/', (req, res) => {
    res.render('index'); // Render the index.ejs file
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});