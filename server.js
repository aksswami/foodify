// __Dependencies__
var express = require('express');
var mongoose = require('mongoose');
var baucis = require('baucis');
var swagger = require('baucis-swagger');


// __Main Program__
// Connect to the Mongo instance
mongoose.connect('mongodb://localhost:27017/FoodifyDB01');


// Create a Mongoose schema
var userSchema = mongoose.Schema({
  userName	: { type : String, require: true},
  passWord	: 	String,
  name 		:   String,
  phoneNumber : { type : String, require: true},
  emailId 	: {	type : String, require: true},
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
  active	: Boolean,
  meta	: {
    following: Number,
    followers:  Number
  }
});

var postSchema = mongoose.Schema({
  imageData : {type:String, require: true},
  postedBy 	: {
  	type 	: mongoose.Schema.Types.ObjectId,
  	ref 	: 'user'
  },
  location	: {
  	latitude	: 	Number,
  	longitude	: 	Number,
  	locationName: 	String
  },
  tags : {
  	type 	: mongoose.Schema.Types.ObjectId,
  	ref		: 'tag'
  },
  upVote	: Number,
  downVote 	: Number,
  description 	: String,
  rating	: Number,
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
  comments	: [{
  	type 	: mongoose.Schema.Types.ObjectId,
  	ref		: 'comment'
  }]
});

var commentSchema = mongoose.Schema({
	commDescription	: String,
	createDate: { type: Date, default: Date.now },
  	updateDate: { type: Date, default: Date.now }
});

var tagSchema = mongoose.Schema({
	tagName : String,
	createDate: { type: Date, default: Date.now },
  	updateDate: { type: Date, default: Date.now }
})
tagSchema.pre('save', function (next) {
	console.log('A tag was saved to Mongo: %s.', this.get('tagName'));
	next();
});



mongoose.model('user', userSchema);
mongoose.model('feed', postSchema);
mongoose.model('comment', commentSchema);
mongoose.model('tag', tagSchema);



var tagSeed = [ '#foodies', '#realfood', '#potatoes', '#burger','#pizza', '#aloo tikki', '#golgappe',
 				'#makhani dal', '#paneer tikka', '#chilli paneer', '#chicken tikka', '#tandoori chicken', '#biryani',
  				'#rice', '#kadhi chawal', '#chhole bhature', '#pao bhaji', '#chhole kulche', '#chana masala', '#rajma chawal', '#vadapao' ];

var tagSeedFunc = tagSeed.map(function (name) { return { tagName: name } });

// Clear the database of old Tags
mongoose.model('tag').remove(function (error) {
	if (error) throw error;
	// Put the fresh vegetables in the database
	mongoose.model('tag').create(tagSeedFunc, function (error) {
		if (error){
			console.log("Error in Tag Seed");
			throw error;
		}
	}); 
});


// Create the API routes
baucis.rest('user');
baucis.rest('feed');
baucis.rest('comment');
baucis.rest('tag');

var app = express();
app.use('/rest', baucis());
app.listen(3333); 
console.log('Server listening on port 3333.');




/*
var userSchema = mongoose.Schema({
  userName	: { type : String},
  passWord	: 	String,
  name 		:   String,
  phoneNumber : { type : String},
  emailId 	: {	type : String},
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
  active	: Boolean,
  meta	: {
    following: Number,
    followers:  Number
  }
});



userSchema.pre('save', function(next){
	console.log('A vegetable was saved to Mongo: %s.', this.get('name'));
	next();
});

// Create a Mongoose schema
var Vegetable = new mongoose.Schema({ name: String });
// Note that Mongoose middleware will be executed as usual
Vegetable.pre('save', function (next) {
console.log('A vegetable was saved to Mongo: %s.', this.get('name'));
next();
});


// Register the schema
mongoose.model('vegetable', Vegetable);
mongoose.model('user', userSchema);
// Create dummy data
var names = [ 'tomato', 'turnip', 'lovage', 'snap pea', 'carrot', 'zucchini' ];
var vegetables = names.map(function (name) { return { name: name } });
// Clear the database of old vegetables
mongoose.model('vegetable').remove(function (error) {
if (error) throw error;
// Put the fresh vegetables in the database
mongoose.model('vegetable').create(vegetables, function (error) {
if (error) throw error;
// Create the API routes
baucis.rest('vegetable');
baucis.rest('user');

// Create the app and listen for API requests
var app = express();
app.use('/api', baucis());
app.listen(3333);
console.log('Server listening on port 3333.');
});
});
*/