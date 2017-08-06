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

//const token=require('../../route/util/token.js');


const User = require('../../route/model/User');
const secret = require('../../config');

const BookQury = require('../qury/bookQury.js');

const AuthBearer = require('hapi-auth-bearer-token');

function hashPassword(password, cb) {
	  // Generate a salt at level 10 strength
	  bcrypt.genSalt(10, (err, salt) => {
	    bcrypt.hash(password, salt, (err, hash) => {
	      return cb(err, hash);
	    });
	  });
	}



//------------------------------------
// this is used for cookie session out
//------------------------------------

var cookie_options = {
		  ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
		  encoding: 'none',    // we already used JWT to encode
		  isSecure: true,      // warm & fuzzy feelings
		  isHttpOnly: true,    // prevent client alteration
		  clearInvalid: false, // remove invalid cookies
		  strictHeader: true   // don't allow violations of RFC 6265
		}


//------------------------------------
//for veryfy unique user
//------------------------------------

function verifyUniqueUser(req, res) {
	  // Find an entry from the database that
	  // matches either the email or username
	  User.findOne({
	    $or: [
	      { email: req.payload.email },
	      { username: req.payload.username }
	    ]
	  }, (err, user) => {
	    // Check whether the username or email
	    // is already taken and error out if so
	    if (user) {
	      if (user.username === req.payload.username) {
	        res(Boom.badRequest('Username taken'));
	      }
	      if (user.email === req.payload.email) {
	        res(Boom.badRequest('Email taken'));
	      }
	    }
	    // If everything checks out, send the payload through
	    // to the route handler
	    res(req.payload);
	  });
	}



//------------------------------------
//this is used fot register
//------------------------------------

function rigester(req, reply) {
	console.log("---------------->>>>");
	console.log(req.payload);
	console.log("--------------->>>>>>>");
	User.findOne({
		$or: [
			{ email: req.payload.email },
			{ username: req.payload.username },
			{mobileNumber:req.payload.mobileNumber}
			]
	}, (err, user) => {

		if(err){
			cb(err);
		}
		console.log("use---r");
		console.log(user);
		if(user==null){
			
			
			hashPassword(req.payload.password, (err, hash) => {
				
				if(err){
					console.log(err);
				}else{
					req.payload.password=hash;
					
					User.create(req.payload, function (err, seved) {
						if (err) {
							reply(err)
							
						}else{

							reply (seved);
						}
						// console.log(seved);
						// saved!
					}) 	
					
				}
				
			});
			
			
		}else{
			if (user) {
				
				
			      if (user.username === req.payload.username) {
			    	 
			    	  reply({'username':'alredy exits'})
			      }
			      else if (user.email === req.payload.email) {
			    	 
			    	  reply({'email':'alredy exits'})
			      }
			      else if (user.mobileNumber === req.payload.mobileNumber) {
			   
			    	  reply({'mobile':'alredy exits'});
			    	  //(Boom.badRequest('Mobile taken'));
				      }
			    }
		}
		//reply(user);
		//res(req.payload);
	});
};




//------------------------------------
//this is used for login 
//------------------------------------

function verifyCredentials(req, reply) {

	  const password = req.payload.password;

	  
	  User.findOne({
	    $or: [
	      { email: req.payload.email },
	      { username: req.payload.username }
	    ]
	  }, (err, user) => {
		  
		  console.log("+++++++");
	    if (user) {
	      bcrypt.compare(password, user.password, (err, isValid) => {
	        if (isValid) {
	        	delete user._id;
	        	delete user.password;
	        	delete user.__v;
	        	//req.auth.session.set(user);
	        	console.log("+++++++");
	        	
	        	 
	        	//var toby = new token(user);
	        	//console.log(token.tokens(user));
	        	//scopes = 'admin';
	        // token = jwt.sign({ id: user._id, username: user.username, scope: scopes }, secret, { algorithm: 'HS256', expiresIn: "1h" } );

	        	//token.createToken(user)
	        	
	        	user.save((err, user) => {
	                if (err) {
	                  throw Boom.badRequest(err);
	                }
	                });
	        	
	        	 reply(user)
	        }
	        else {
	        	reply(Boom.badRequest('Incorrect password!'))
	        	
	          //res(Boom.badRequest('Incorrect password!'));
	        }
	      });
	    }
	    else {
	    	reply(Boom.badRequest('Incorrect email!'))
	      //res(Boom.badRequest('Incorrect username or email!'));
	    }
	    
	    
	  });
	}



//------------------------------------
//this is used for creating token  
//------------------------------------

function createToken(user) {
	  let scopes;
	  
	  if (user.admin) {
	    scopes = 'admin';
	  }
	  // Sign the JWT
	  return jwt.sign({ id: user._id, username: user.username, scope: scopes }, secret, { algorithm: 'HS256', expiresIn: "1h" } );
	}


 /*
var people = {
	    1: {
	      id: 1,
	      name: 'Valid User'
	    }
	};
	*/
	// use the token as the 'authorization' header in requests
	//var token = jwt.sign(people[1], secret); // synchronous


//console.log(token);

//-----------------------------------------------------------------------------------------
//this is used for validation token here we can use db for token but as of now i havent used
//-----------------------------------------------------------------------------------------
var validate = function (decoded, request, callback) {
	console.log("decoded.scope-----");
	console.log(decoded.scope);
	console.log("decoded.scope-----");
	  //if (!people[decoded.id]) {
	
	return callback(null, true);
/*	if (!decoded.scope) {
		console.log("eeeee-->>>>>>");
	    return callback(null, false);
	  }
	  else {
	    return callback(null, true);
	  }*/
	
};


//---------------------------------------------------------------------------------------------------------------------------
exports.register = function(server,options,next) {

	
	server.auth.strategy('jwt', 'jwt', {
	    key: secret,
	    
	    verifyFunc:validate,
	    verifyOptions: { algorithms: ['HS256'] }
	  });
	 
	 //#######################################
	 // creat auth with user 
	 //#######################################
	 server.route({
			method: 'POST',
			path: '/admin/users/authenticate',
			config: {
			    // Check the user's password against the DB
			    pre: [
			      { method: verifyCredentials, assign: 'user' }
			    ],
			    handler: (req, res) => {
			      // If the user's password is correct, we can issue a token.
			      // If it was incorrect, the error will bubble up from the pre method
			      res({ id_token: createToken(req.pre.user) }).code(201);
			    },
			    validate: {
			      payload: Joi.alternatives().try(
			    		  Joi.object({
			    			    username: Joi.string().alphanum().min(2).max(30).required(),
			    			    password: Joi.string().required()
			    			  }),
			    			  Joi.object({
			    			    email: Joi.string().email().required(),
			    			    password: Joi.string().required()
			    			  })
			    			  )
			    }
			  }
		});
	 
	 
	 
	 //###############################
	 // this is for login user
	 //###############################
	server.route({
		method: 'POST',
		path: '/login',
		config: {
			
			
			handler: (request, reply) => {
				console.log(request.payload.username);
				console.log(request.payload.password);
				
				verifyCredentials(request,reply);
				//reply({ id_token: createToken(request.pre.user) }).code(201);
				//reply({'login successful...':'and made hapi'});
			},
			validate: {
				
				payload: Joi.object({

					email:Joi.string().email().required(),
					password: Joi.string().alphanum().required().regex(/[a-zA-Z0-9]/).trim()

				})
			}
			 
		}
	});
	
	//##################################
	// list all the users with authntication 
	//###################################
	server.route({
		 method: 'GET',
		  path: '/admin/users',
		  config: {
		    handler: (req, res) => {
		      User
		        .find()
		        // Deselect the password and version fields
		        .select('-password -__v')
		        .exec((err, users) => {
		          if (err) {
		            throw Boom.badRequest(err);
		          }
		          if (!users.length) {
		            throw Boom.notFound('No users found!');
		          }
		          res(users);
		        })
		    },
		    // Add authentication to this route
		    // The user must have a scope of `admin`
		    auth: {
		      strategy: 'jwt'
		    }
		  }
	});
	
	
	//#####################################
	// list the indviual user with auth key
	//#####################################
	
	server.route({
		method: 'GET',
		path: '/admin/individuals/{uid}',
		config: {
			handler: (request, reply) => {
				
				
				BookQury.oneuser(request,reply);
				//reply({'login successful...':'and made hapi'});
			},auth: {
			      strategy: 'jwt'
			    }
			 
		}
	});
	
	//#####################################
	// list the indviual user without auth key
	//#####################################
	server.route({
		method: 'GET',
		path: '/individuals/{uid}',
		config: {
			handler: (request, reply) => {
				
				
				BookQury.oneuser(request,reply);
				//reply({'login successful...':'and made hapi'});
			}
			 
		}
	});
	
	//#####################################
	// delet user with auth
	//#####################################
	
	server.route({
		method: 'DELETE',
		path: '/admin/delete/{uid}',
		config: {
			handler: (request, reply) => {
				
				
				BookQury.deleteuser(request,reply);
				//reply({'login successful...':'and made hapi'});
			},auth: {
			      strategy: 'jwt'
			    }
			 
		}
	});
	
	//#####################################
	// delet user without auth
	//#####################################
	
	server.route({
		method: 'DELETE',
		path: '/delete/{uid}',
		config: {
			handler: (request, reply) => {
				
				
				BookQury.deleteuser(request,reply);
				//reply({'login successful...':'and made hapi'});
			}
		}
	});
	
	
	
	//###############################################
	// To auth with admin and insert into Db        #
	//###############################################
	server.route({
		method: 'POST',
		path: '/adminvalid/users',
		config: {
		    // Before the route handler runs, verify that the user is unique
		    pre: [
		      { method: verifyUniqueUser }
		    ],
		    handler: (req, res) => {

		      let user = new User();
		      user.email = req.payload.email;
		      user.username = req.payload.username;
		      user.admin = false;
		      hashPassword(req.payload.password, (err, hash) => {
		        if (err) {
		          throw Boom.badRequest(err);
		        }
		        user.password = hash;
		        user.save((err, user) => {
		          if (err) {
		            throw Boom.badRequest(err);
		          }
		          // If the user is saved successfully, issue a JWT
		          res({ id_token: createToken(user) }).code(201);
		        });
		      });

		    },
		    // Validate the payload against the Joi schema
		    validate: {
		      payload: {
		    	  username: Joi.string().min(2).max(30).required(),
		    	  email: Joi.string().email().required(),
		    	  password: Joi.string().required()
		      }
		    }
		  }
	});
	
	
	
	//###############################################
	// list users with late fee with auth           #
	//###############################################
	
	server.route({
		method: 'GET',
		path: '/admin/late_fees',
		config: {
			handler: (request, reply) => {
				
				
				BookQury.latefees(request,reply);
				//reply({'login successful...':'and made hapi'});
			},auth: {
			      strategy: 'jwt'
			    }
			 
		}
	});
	

	//###############################################
	// list users with late fee without auth           #
	//###############################################
	
	server.route({
		method: 'GET',
		path: '/late_fees',
		config: {
			handler: (request, reply) => {
				
				
				BookQury.latefees(request,reply);
				//reply({'login successful...':'and made hapi'});
			}
			 
		}
	});
	
	
	//###############################
	//update the user with auth
	//###############################
	server.route({
		method: ['PUT', 'PATCH'],
		path: '/admin/update/{uid}/{bid}',
		config: {
			handler: (request, reply) => {
				
				
				BookQury.updateUserBook(request,reply);
				//reply({'login successful...':'and made hapi'});
			},auth: {
			      strategy: 'jwt'
			    },
			validate: {
				payload: Joi.object({
					
					title:Joi.string().min(4).required(),
					author:Joi.string().min(4).required().regex(/[a-zA-Z]/).trim(),
					genre:Joi.string().min(4).regex(/[a-zA-Z]/).trim().required(),
					borrowed: Joi.object().keys({
						staus:Joi.boolean().required().truthy(true),
						dueDate:Joi.string().required()
					}),
					latefees:Joi.boolean().required(),
					publication:Joi.object().keys({
						
						//date published, publisher\\\\
						publishedDate:Joi.string().required(),
						publisher: Joi.string().min(4).required(),
						other:Joi.any().required()
					}),
					availability:Joi.object().keys({
						
						//date published, publisher\\\\
						reserved: Joi.boolean().required().truthy(true),
						borrowed: Joi.string().min(3).required(),
						copies:Joi.any().required(),
						other:Joi.any().required()
					})

				})
			}
			 
			 
		}
	});
	
	//###############################
	//update the user without auth
	//###############################
	server.route({
		method: ['PUT', 'PATCH'],
		path: '/update/{uid}/{bid}',
		config: {
			handler: (request, reply) => {
				
				
				BookQury.updateUserBook(request,reply);
				//reply({'login successful...':'and made hapi'});
			},
			validate: {
				payload: Joi.object({
					
					title:Joi.string().min(4).required(),
					author:Joi.string().min(4).required().regex(/[a-zA-Z]/).trim(),
					genre:Joi.string().min(4).regex(/[a-zA-Z]/).trim().required(),
					borrowed: Joi.object().keys({
						staus:Joi.boolean().required().truthy(true),
						dueDate:Joi.string().required()
					}),
					latefees:Joi.boolean().required(),
					publication:Joi.object().keys({
						
						//date published, publisher\\\\
						publishedDate:Joi.string().required(),
						publisher: Joi.string().min(4).required(),
						other:Joi.any().required()
					}),
					availability:Joi.object().keys({
						
						//date published, publisher\\\\
						reserved: Joi.boolean().required().truthy(true),
						borrowed: Joi.string().min(3).required(),
						copies:Joi.any().required(),
						other:Joi.any().required()
					})

				})
			}
			 
			 
		}
	});
	
	//###################################
	// list the barrow books with out auth
	//####################################
	server.route({
		method: 'POST',
		path: '/userborrowsBook/{uid}',
		config: {
			handler: (request, reply) => {
				console.log(request.payload.username);
				console.log(request.payload.password);
				
				BookQury.userborrowsBook(request, reply);
				//reply({'login successful...':'and made hapi'});
			},
			validate: {
				payload: Joi.object({
					
					title:Joi.string().min(4).required(),
					author:Joi.string().min(4).required().regex(/[a-zA-Z]/).trim(),
					genre:Joi.string().min(4).regex(/[a-zA-Z]/).trim().required(),
					borrowed: Joi.object().keys({
						staus:Joi.boolean().required().truthy(true),
						dueDate:Joi.string().required()
					}),
					latefees:Joi.boolean().required(),
					publication:Joi.object().keys({
						
						//date published, publisher\\\\
						publishedDate:Joi.string().required(),
						publisher: Joi.string().min(4).required(),
						other:Joi.any().required()
					}),
					availability:Joi.object().keys({
						
						//date published, publisher\\\\
						reserved: Joi.boolean().required().truthy(true),
						borrowed: Joi.string().min(3).required(),
						copies:Joi.any().required(),
						other:Joi.any().required()
					})

				})
			}
			 
		}
	});


	
	//########################################
	//rigister with out auth
	//##########################################

	server.route({
		method: 'POST',
		path: '/register',
		config: {
			handler: (request, reply) => {
				console.log(request.payload.username);
				console.log(request.payload.password);
			    rigester(request,reply);
				//reply({'you registerd successful...':'and made hapi'});
			},
			validate: {
				payload: Joi.object({

					username: Joi.string().min(4).max(15).regex(/[a-zA-Z]/).required(),
					password: Joi.string().alphanum().regex(/[a-bA-Z0-9]/).required(),
					email:Joi.string().email().required(),
					mobileNumber:Joi.string().min(10).max(10).required()

				})
			}
		}
	});








	return next();
};

exports.register.attributes = {  
		name: 'routes-validationjoicontroller'
};