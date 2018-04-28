const mongoose = require('mongoose');

// Mongoose Schema
const Schema = mongoose.Schema;
    // ObjectId = Schema.ObjectId;
 
const VendorModel = new Schema({
//  author: ObjectId,
  name: String,
  phone: String,
  city: String,
  country: String,
  status: {type: Boolean, default: false},
  socketId: String,
  date: Date
});

module.exports = mongoose.model('VendorModel', VendorModel);