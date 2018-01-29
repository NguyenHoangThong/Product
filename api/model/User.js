const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;
//ObjectId = Schema.ObjectId;

const saltRounds = 10;

const userSchema = new Schema({
    username  : {type: String, unique : true, require: true},
    password  : {type: String, require: true}
});

userSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
    next();
});

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
