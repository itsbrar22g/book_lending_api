'use strict';

const Boom = require('boom');  
const uuid = require('node-uuid');  
const Joi = require('joi');
var Path = require('path');
var Fs = require('fs');
var Rot13 = require('rot13-transform');
var H2o2 = require('h2o2');
const bcrypt = require('bcrypt');
const base = require('base');
const jwt = require('jsonwebtoken');
const cookie=require('cookie');
const BookQury = require('../qury/bookQury.js');
//const token=require('../../route/util/token.js');


const Book = require('../../route/model/book');
const Avilability = require('../../route/model/avilability');

const secret = require('../../config');


exports.register = function(server, options, next) {

	
	
	
	const db = server.app.db;

	
	 

	 
     //#############
	//add book
	//#############
	
	server.route({
		method: 'POST',
		path: '/abbBook',
		config: {
			handler: (request, reply) => {
				
				
				BookQury.addBook(request,reply);
				
				
				//reply({'login successful...':'and made hapi'});
			},
			validate: {
				payload: Joi.object({
					title:Joi.string().min(4).required(),
					author:Joi.string().min(4).required().regex(/[a-zA-Z]/).trim(),
					genre:Joi.string().min(4).regex(/[a-zA-Z]/).trim().required(),
					borrowed: Joi.object().keys({
						staus:Joi.boolean().required(),
						dueDate:Joi.string().required()
					}),
					publication:Joi.object().keys({
						
						//date published, publisher\\\\
						publishedDate:Joi.string().required(),
						publisher: Joi.string().min(4).required(),
						other:Joi.any().required()
					}),
					availability:Joi.object().keys({
						
						//date published, publisher\\\\
						reserved: Joi.boolean().required(),
						borrowed: Joi.string().min(2).required(),
						copies:Joi.any().required(),
						other:Joi.any().required()
					})

				})
			}
			 
		}
	});
	
	//#################
	//get list of books
	//#################
	
	server.route({
		method: 'GET',
		path: '/listOfBooks',
		config: {
			handler: (request, reply) => {
				
				
				BookQury.listOfBooks(request,reply);
				//reply({'login successful...':'and made hapi'});
			}
			
			 
		}
	});
	
	
	//########################
	//using qury list of books
	//########################
	server.route({
		method: 'GET',
		path: '/qurylistOfBooks',
		config: {
			handler: (request, reply) => {
				//console.log(request.payload.username);
				console.log("query list");
				
				BookQury.qurylistOfBooks(request,reply);
				
				//reply({'login successful...':'and made hapi'});
			}
			
			 
		}
	});
	
	//####################
	//get delete book
	//#####################
	server.route({
		method: 'DELETE',
		path: '/deleteBooks/{bid}',
		config: {
			handler: (request, reply) => {
				
				
				BookQury.deleteBooks(request,reply);
				//reply({'login successful...':'and made hapi'});
			}
			
			 
		}
	});
	
	//####################
	//get individual book
	//#####################
	server.route({
		method: 'GET',
		path: '/individual/{uid}',
		config: {
			handler: (request, reply) => {
				
				BookQury.getIndividual(request,reply);
				//reply({'login successful...':'and made hapi'});
			}
			
			 
		}
	});
	
	
	//####################
	//get update book
	//#####################
	
	server.route({
		method: ['PUT', 'PATCH'],
		path: '/update/{bid}',
		config: {
			handler: (request, reply) => {
				
				
				BookQury.updateBooks(request,reply);
				//reply({'login successful...':'and made hapi'});
			},
			validate: {
				payload: Joi.object({
					title:Joi.string().min(4).required(),
					author:Joi.string().min(4).regex(/[a-zA-Z]/).trim().required(),
					genre:Joi.string().min(4).regex(/[a-zA-Z]/).trim().required(),
					borrowed: Joi.object().keys({
						staus:Joi.boolean().required(),
						dueDate:Joi.string().required()
					}),
					publication:Joi.object().keys({
						
						//date published, publisher\\\\
						publishedDate:Joi.string().required(),
						publisher: Joi.string().min(4).required(),
						other:Joi.any().required()
					}),
					availability:Joi.object().keys({
						
						//date published, publisher\\\\
						reserved: Joi.boolean().required(),
						borrowed: Joi.string().min(2).required(),
						copies:Joi.any().required(),
						other:Joi.any().required()
					})

				})
			}
			 
		}
	});



	





	return next();
};

exports.register.attributes = {  
		name: 'routes-bookInfo'
};