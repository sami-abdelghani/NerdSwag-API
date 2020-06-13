let mongoose = require('mongoose');
let schema = mongoose.Schema;

let obj_id = mongoose.Schema.Types.ObjectId;

let account = new schema({
    username: String,
    password: String,
    email: String,
    balance: Number,
    wishlist: [{type: obj_id, ref: 'WishList'}],
    cart: [{type: obj_id, ref: 'Cart'}]
});

module.exports = mongoose.model('Account', account);
