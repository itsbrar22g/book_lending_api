

'use strict';

//###############################################################################################################################
//using mongoose we are creating avilbility  collection it is a sub collection of book collection in mongo db with set of ruels
//###############################################################################################################################
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const avilability = new Schema({
	reserved: { type: Boolean, required: true},
  //username: { type: String, required: true, index: { unique: true } },
	borrowed: { type: String, required: true},
	copies :{type: Object, required: true},
	other :{type: Object, required: true},
	
	
});




module.exports = mongoose.model('avilability', avilability);