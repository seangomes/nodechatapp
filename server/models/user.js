var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    oid: String,
    username: String
});

module.exports = mongoose.model('User', UserSchema);