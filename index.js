//require modules
const express = require('express');
const app = express();
const cors = require('cors');
const env = require('dotenv').config();
const config = require('config');
const JSONResponseHeader = require('./middleware/JSONResponseHeader');

app.use(express.json());

//create CORS options object to access custom headers in the frontend fetch API
const corsOptions = {
    exposedHeader: ['OUR CUSTOM NAME FOR THE HEADER'] //ADD OUR CUSTOM HEADER NAME
}
app.use(cors(corsOptions));
app.use(JSONResponseHeader);
app.use('/api/accounts/login', login); //i am uncertain if ACCOUNTS here needs to be changed to something else for our project?
//the below line has to be below the above line because express reads from top to bottom
app.use('/api/users', users);//uncertain if this in fact needs to be "users". It was "profiles" in Gery's example

app.listen(config.get('port'), console.log(`Listening on port: ${config.get('port')}...`)) //in the config folder we have port in lowercase
