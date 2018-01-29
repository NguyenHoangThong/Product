const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

const saltRounds = 10;

const productSchema = new Schema({
    userID: {type: ObjectId, ref: 'User'},
    name  : {type: String, require: true},
    price  : {type: String, require: true}
});


const Product = mongoose.model('Product', productSchema);
module.exports = Product;
