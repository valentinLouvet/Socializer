var mongoose = require('mongoose');



var postSchema = new mongoose.Schema({
    created_by:  String,
    created_at: {type:Date, default: Date.now()},
    text: String
});

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

mongoose.exports = mongoose.model('Post', postSchema);
mongoose.exports = mongoose.model('User', userSchema);