/**
 * Import libraries, routers, controllers, database connection
 */

// Import Libraries
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Configure environment variables
require("dotenv").config()

// Import Database
const connectDB = require('./config/database');

// Import Routers
const apiRouter = require('./routes/api');

// Set up Express
const app = express();

/**
 *--------- GENERAL SETUP -------------
 */
// Morgan Logger
app.use(morgan('dev'));

// Connect to Database
connectDB()

// Express body-parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }))

// Set up cors - GET, POST, PUT, PATCH, and other REQUEST
app.use(cors());

// Set up Routers
app.use('/api', apiRouter); // API Router

app.listen(process.env.PORT, () => console.log('App is listening on url http://localhost:' + process.env.PORT));