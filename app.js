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
const initCouch = require('./config/init');

// Import Routers
const apiRouter = require('./routes/api');

// Set up Express
const app = express();

// Set up CouchDB

initCouch(function(err) {
    if (err) {
        throw err
    } else {
        console.log('couchdb initialized');
    }
});


/**
 *--------- GENERAL SETUP -------------
 */
// Morgan Logger
app.use(morgan('dev'));


// Express body-parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }))

// Set up cors - GET, POST, PUT, PATCH, and other REQUEST
app.use(cors());

// Set up Routers
app.use('/api', apiRouter); // API Router

app.listen(process.env.PORT, () => console.log('App is listening on url http://localhost:' + process.env.PORT));