let mongoose = require('mongoose');
let schema = mongoose.Schema;

let obj_id = mongoose.Schema.Types.ObjectId;

/* An account schema that makes each account have a username,
 password, email, available account balance, the account's associated wishlist,
  and the account's associated cart*/
let account = new schema({
    username: String,
    password: String,
    email: String,
    balance: Number,
    wishlist: [{type: obj_id, ref: 'Product'}],
    cart: [{type: obj_id, ref: 'Product'}]
});

module.exports = mongoose.model('Account', account);
