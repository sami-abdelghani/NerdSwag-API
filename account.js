let mongoose = require('mongoose');
let schema = mongoose.Schema;

let obj_id = mongoose.Schema.Types.ObjectId;

/* An account schema that that makes each account have a username,
 password, email, available account balance, the accoutn's associated wishlist,
  and the account's associated cart*/
let account = new schema({
    username: String,
    password: String,
    email: String,
    balance: Number,
    wishlist: [{type: obj_id, ref: 'WishList'}],
    cart: [{type: obj_id, ref: 'Cart'}]
});

module.exports = mongoose.model('Account', account);
