var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    oid: String,
    username: String,
    admin: Boolean,
});

module.exports = mongoose.model('User', UserSchema);