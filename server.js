
// My entry-point file

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/connection');


const app = express();

// Middleware
app.use(express.json());

// Connect to database
connectDB();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
