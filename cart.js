let mongoose = require('mongoose');
let schema = mongoose.Schema

let obj_id = mongoose.Schema.Types.ObjectId;

/*A cart schema to make sure each cart has a title
and the desired user's chosen product data*/
let cart = new schema({
    title: {type: String, default: "NerdSwag Cart"},
    products: [{type: obj_id, ref: 'Product'}]
});

module.exports = mongoose.model('Cart', cart);
