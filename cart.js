let mongoose = require('mongoose');
let schema = mongoose.Schema

let obj_id = mongoose.Schema.Types.ObjectId;

let cart = new schema({
    title: {type: String, default: "NerdSwag Cart"},
    products: [{type: obj_id, ref: 'Product'}]
});

module.exports = mongoose.model('Cart', cart);
