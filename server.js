'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const secret = require('./config');
const AuthBearer = require('hapi-auth-bearer-token');
//const Hapi = require('hapi');  
//const mongojs = require('mongojs');

// Create a server with a host and port
const server = new Hapi.Server();  
server.connection({  
	 host: 'localhost',
	    port: 3000
});


// db url
const dbUrl = 'mongodb://localhost:27017/learnyoumongo';



server.register([AuthBearer,require('hapi-auth-jwt2'),require('./api/routes/users'),require('./api/routes/bookInfo')], (err) => {
	
  
  glob.sync('../api/**routes/*.js', {
    root: __dirname
  }).forEach(file => {
    const route = require(path.join(__dirname, file));
    
    console.log(route);
    server.route(route);
  });
});

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  
  console.log('Server running at:', server.info.uri);
  
  // Once started, connect to Mongo through Mongoose
  mongoose.connect(dbUrl, {db: { native_parser: true }}, (err) => {
    if (err) {
      throw err;
    }
  });
});

