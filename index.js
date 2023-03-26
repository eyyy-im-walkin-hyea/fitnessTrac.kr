require('dotenv').config();
const PORT = 1337;
const express = require('express');
const server = express();
const morgan = require('morgan');
const cors = require('cors');

// MIDDLEWARE
server.use(morgan('dev'));
server.use(express.json());
server.use(cors());
server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });

// API ROUTER
const apiRouter = require('./api');
server.use('/api', apiRouter);

// server.use((error, req, res, next) => {
//     res.send(error);
// })

// CONNECT CLIENT
const client = require("./db/client");
client.connect();

// SERVER START UP
server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
});