const express = require('express');

const server = express();

server.use(express.json());

const userRouter = require('./users/userRouter.js');
server.use('/api/users', userRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {}

module.exports = server;
