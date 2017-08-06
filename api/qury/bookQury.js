const User = require('../../route/model/User');
const Book = require('../../route/model/book');
const Avilability = require('../../route/model/avilability');

//######################################
// this is used for querys
// ####################################
module.exports ={ 
		

		updateBooks:function(req, reply) {
			var data=req.payload.availability;
			  delete req.payload.availability;
			console.log(data);
			console.log(req.params.bid);
			var bid=req.params.bid || "";
			var avlId;
			Book.findOne({'_id': bid}).exec(function(err,books){
				console.log(books.avlId);
				avlId =books.avlId;
			});
			Book.update({'_id': bid},req.payload,{upsert: true}).exec(function(err,books){
				console.log("books---->>");
				console.log(books);
				if(err){
					reply(err);
				}else if(!books){
					reply("somthing went wrong");
					
				}
				else{
					console.log(data);
					console.log(avlId);
					Avilability.update({"_id":avlId},data,{upsert: true}).exec(function(err,avilbooks){
						
						if(err){
							reply(err);
						}else if(!avilbooks){
							reply("somthing went wrong");
						}
						else{
							reply({"status":"sucess"});
						}
					});
				}
			})
		}
		,
		deleteBooks:function(req, reply) {
			
			console.log(req.params.bid);
		var id=req.params.bid || "";
		var avlId;

		Book.findOne({"_id":id}).exec(function(err,books){
			console.log(books);
			if(err){
				reply(err);
			}else if(!books){
				reply("somthing wrong")
			}else{
				Book.remove({'_id':books.id}).exec(function (err,dest){
					if(err){
						reply(err)
					}else{
						console.log(books.avlId);
						Avilability.remove({'_id':books.avlId}).exec(function (err,avi){
							if(err){
								reply(err);
							}else{
								reply(avi)
							}
						});
						
					}
				});
				
			}
			
			
		});
	},	

		getIndividual:function(req, reply) {
			console.log(req.params.uid);
			var id=req.params.uid || "";
			var detailBooks=[]
			Book.findOne({"_id":id}).exec(function(err,books){
				console.log(books);
				if(err){
					reply(err);
				}else if(!books){
					reply("somthing wrong")
				}else{
					Avilability.findOne({"_id":books.avlId}).exec(function(err,avilbooks){
						console.log(avilbooks);
						if(err){
							reply(err);
						}else if(!avilbooks){
							reply("somthing wrong")
						}else{
							detailBooks.push({"book":books,"avilabilebook":avilbooks});
							reply(detailBooks);
						}
					});
				}
				
				
			});
		},
		qurylistOfBooks:function(req, reply) {
			//console.log(req.payload.author);
			var query = req.query || "{}";
			
			console.log(query);
			
			Book.find(query).limit(5).exec(function(err,books){
				console.log(books);
				if(err){
					reply(err)
				}
				else if(books.length==0){
					reply("no books")
				}
				else{
					var avilList = [];
					for(var i=0,len=books.length;i < len; i++){
						avilList[i] = books[i]. avlId;
					}
					
				Avilability.find({"_id":avilList}).exec(function(err,avilbooks){
					
					
					
					var allDetail=[];
					for(var i=0,len=books.length;i < len; i++){
						avilList[i] = books[i]. avlId;
						for(var j=0,len=avilbooks.length;j < len; j++){
							if(books[i]. avlId==avilbooks[j]._id){
								console.log(books[i]. avlId);
								delete books[i].avlId;
								allDetail.push({'books':books[i],'avilbooks':avilbooks[j]});
								
							};
						}
					}
					console.log(allDetail)
					reply(allDetail)
				});
				
				}
				
			});
			 
		}

        ,
		listOfBooks : function(req, reply) {
			
			Book.find().limit( 5).exec(function(err,books){
				//console.log(books);
				if(err){
					reply(err)
				}
				else if(books.length==0){
					reply("no books")
				}
				else{
					var avilList = [];
					for(var i=0,len=books.length;i < len; i++){
						avilList[i] = books[i]. avlId;
					}
					
				Avilability.find({"_id":avilList}).exec(function(err,avilbooks){
					
					
					
					var allDetail=[];
					for(var i=0,len=books.length;i < len; i++){
						avilList[i] = books[i]. avlId;
						for(var j=0,len=avilbooks.length;j < len; j++){
							if(books[i]. avlId==avilbooks[j]._id){
								console.log(books[i]. avlId);
								delete books[i].avlId;
								allDetail.push({'books':books[i],'avilbooks':avilbooks[j]});
								
							};
						}
					}
					console.log(allDetail)
					reply(allDetail)
				});
				
				}
				
			});
			 
		},
		addBook: function (req, reply) {
			
			console.log(req.payload.availability);
			
			if(req.payload){
				//var data=req.payload;
				//delete data.availability;
				console.log("avi***** " +req.payload.availability);
				Avilability.create(req.payload.availability, function (err, seved) {
					console.log("avi:::::::::-->>" +seved);
					if(err){
						reply(err)
					}
					else if(!seved){
						Boom.badRequest('Some Error')
					}else{
						console.log(seved._id);
						delete req.payload.availability
						req.payload.avlId=seved._id
						console.log(req.payload);
						
						
							  
						Book.create(req.payload, function (err, created) {
							if(err){
								reply(err)
							}else if(!created) {
								Boom.badRequest('Some Error')
							}else{
								
								created.save({_creator: created._id});
								reply(created)
							}
							
						});
					}
				});
				/*Book.create(req.payload, function (err, seved) {
					
					
				});*/
			}
			//if()
		    
			//User.findOne({}).
		},
		
		allusers : function  (request, reply) {
			
			console.log("))))))---");
			
			User.find().exec(function(err,user){
				console.log(user);
				if(err){
					reply(err)
				}else if(!user){
					reply("sothing wern wrong").code(401)
				}
				else{
					reply(user);
				}
				
			});
			
		},
		
		
		updateUserBook : function  (request, reply) {
			
			var availability=request.payload.availability;
			
Book.findOne({"_id":request.params.bid}).exec(function(err,book){
				
				if(err){
					reply(err)
				}else if(!book){
					reply("no book found").code(404);
				}else{
					console.log("bid --->>  kk");
					console.log(request.params.uid);
					book.userId=request.params.uid
					book.save(function (err) {
						
					    if (err) return reply(err);
					    // thats it!
					    console.log(book.avlId);
					    console.log(availability);
					    Avilability.update({"_id":book.avlId},availability,{upsert: true}).exec(function(err,avilbooks){
							
							if(err){
								reply(err);
							}{
								reply({'status':'success'});
							}
						});
					  });
					
					
				}
				
			});
			
			delete request.payload.availability;
			Book.update({'_id': request.params.bid},request.payload,{upsert: true}).exec(function(err,books){
				
			});
			
		},
		oneuser : function  (request, reply) {
			
			
			User.findOne({'_id':request.params.uid}).exec(function(err,user){
				console.log(user);
				if(err){
					reply(err)
				}else if(!user){
					reply("sothing wern wrong").code(401)
				}
				else{
					reply(user);
				}
				
			});
			
		},
		
deleteuser : function  (request, reply) {
			
			
			User.remove({'_id':request.params.uid}).exec(function(err,user){
				console.log(user);
				if(err){
					reply(err)
				}else if(!user){
					reply("sothing wern wrong").code(401)
				}
				else{
					reply(user);
				}
				
			});
			
		},
		
		latefees : function  (request, reply) {
			
			var query = request.query || "{}";
			
			console.log(query);
			
			Book.find(query).populate(['userId','avilabilityId']).exec(function(err,book){
				console.log(err);
				if(err){
					reply(err)
				}else if(!book){
					reply("sothing wern wrong").code(401)
				}else{
					
					reply(book);
				}
				
			});
			
			/*User.remove({'_id':request.params.uid}).exec(function(err,user){
				console.log(user);
				if(err){
					reply(err)
				}else if(!user){
					reply("sothing wern wrong").code(401)
				}
				else{
					reply(user);
				}
				
			});*/
			
		},
		
		
		
		userborrowsBook : function  (request, reply) {
			console.log(request.params.uid);
	//console.log(request.payload );
	
	User.findOne({"_id":request.params.uid}).exec(function(err,user){
		
		if(err){
			reply(err)
		}else if(!user){
			reply("sothing wern wrong").code(401)
		}
		else{
			console.log("========user========");
			console.log(user);
			console.log(request.params.bid);
			console.log(request.payload.availability);
			console.log(request.payload);
			var availability=request.payload.availability;
			console.log("-------");
			if(request.payload.borrowed.staus==true && request.payload.availability.reserved==true){
				console.log("---------------------------------------->>>");
				delete request.payload.availability;
				
				console.log(availability);
				
				Avilability.create(availability, function (err, seved) {
					
					
					if (err) {
						reply(err);
						
					}else if(!seved){
						reply("somthing went wrong").code(401);
						
					}
					 
					else{
						request.payload.avlId=seved._id;
						var savidId=seved._id;
						Book.create(request.payload, function (err, book) {
							if (err) {
								reply(err);
								
							}else if(!book){
								reply("somthing went wrong").code(401);
								
							}
							 
							else{
								
								book.userId=request.params.uid
								book.avilabilityId=savidId;
								book.save(function (err) {
									
								    if (err) return reply(err);
								    });

								reply (seved);
							}
							// console.log(seved);
							// saved!
						}) 	
					}
				});
				
				
				/*Book.findOne({"_id":request.params.bid}).exec(function(err,book){
				
				if(err){
					reply(err)
				}else if(!book){
					reply("no book found").code(404);
				}else{
					console.log("bid --->>  kk");
					console.log(request.params.uid);
					book.userId=request.params.uid
					book.save(function (err) {
						
					    if (err) return reply(err);
					    // thats it!
					    console.log(book.avlId);
					    console.log(availability);
					    Avilability.update({"_id":book.avlId},availability,{upsert: true}).exec(function(err,avilbooks){
							
							if(err){
								reply(err);
							}
						});
					  });
					
					
				}
				
			});
			
			delete request.payload.availability;
			Book.update({'_id': request.params.bid},request.payload,{upsert: true}).exec(function(err,books){
				
			});
			
			*/
			}else{
				reply("borrowed status shuld be true and reserved shuld be true").code(401);
			}
			
		}
	})
	
	
	
}

}