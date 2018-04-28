const mongoose = require('mongoose');

// Mongoose Schema
const Schema = mongoose.Schema;
    // ObjectId = Schema.ObjectId;
 
const OrderItemModel = new Schema({
//  author: ObjectId,
  vendorId: String,
  branchId: String,
  inStock: {type: Boolean, default: true},
  name: String,
  ingredients: Array,
});

module.exports == mongoose.model('OrderItemModel', OrderItemModel);