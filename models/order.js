const mongoose = require('mongoose');

// Mongoose Schema
const Schema = mongoose.Schema;
    // ObjectId = Schema.ObjectId;
 
const OrderModel = new Schema({
//  author: ObjectId,
  vendorId: String,
  branchId: String,
  userId: String,
  driverId: String,
  items: Array,
  totalAmount: String,
  isPaid: Boolean,
  createdAt: {type: Date, default: Date.now()},
});

module.exports == mongoose.model('OrderModel', OrderModel);