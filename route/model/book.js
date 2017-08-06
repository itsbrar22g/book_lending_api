

'use strict';

//##############################################################################
//using mongoose we are creating book collection in mongo db with set of ruels
//#############################################################################

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');  
const bookModel = new Schema({
	title: { type: String, required: true},
  //username: { type: String, required: true, index: { unique: true } },
	author: { type: String, required: true},
	genre: { type: String, required: true },
	publication:{ type: Object, required: true },
	borrowed:{ type: Object, required: true },
	//other :{type: Object, required: true},
	avlId:{type: String, required: true},
	latefees:{type: Boolean, required: false},
	userId : { type: Schema.Types.ObjectId, ref: 'User' }, // for db relation
	avilabilityId : { type: Schema.Types.ObjectId, ref: 'avilability' } //for db relation
});




module.exports = mongoose.model('book', bookModel);