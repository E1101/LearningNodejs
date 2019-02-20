const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/catalog');


let   Schema   = mongoose.Schema;
let itemSchema = new Schema ({
    "itemId" : {type: String, index: {unique: true}},
    "itemName": String,
    "price": Number,
    "currency" : String,
    "categories": [String]
});

let CatalogItem = mongoose.model('Item', itemSchema);

module.exports  = {CatalogItem : CatalogItem};
