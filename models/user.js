var mongoose = require('mongoose');


var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

//add bunch of methods from passportLocalMongoose to our user schema    
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
