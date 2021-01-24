// Complete your server here!
// Do NOT `server.listen()` inside this file!

const express = require('express');
const helmet = require('helmet');
const projectRouter = require('./projects/projects-router');
const actionsRouter = require('./actions/actions-router');

const server = express();

server.use(express.json());
server.use(helmet());

server.use(logger);
server.use('/api/projects', projectRouter);
server.use('/api/actions', actionsRouter);

server.get('/', (req, res) => {
  res.send(`<h2>You have entered the web-sprint-challenge-build-a-web-api</h2>`);
});

//custom middleware

function logger(req, res, next) {
 // console.log(req);
 let date = new Date();

 console.log(
   `${req.method} request, 
   URL: ${req.headers.host}${req.originalUrl}, 
   Date: ${date}`
  );

 next();
};

server.use((error, req, res, next) => { // we can check to ensure error codes are always there
  res.status(error.code).json({message: "Error:", error}) 
});


module.exports = server;
