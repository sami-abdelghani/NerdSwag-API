let mongoose = require('mongoose');
let schema = mongoose.Schema

let obj_id = mongoose.Schema.Types.ObjectId;

let wishlist = new schema({
    title: {type: String, default: "NerdSwag Wishlist"},
    products: [{type: obj_id, ref: 'Product'}]
});

module.exports = mongoose.model('WishList', wishlist);
