const mongoose = require('mongoose');

// Mongoose Schema
const Schema = mongoose.Schema;
    // ObjectId = Schema.ObjectId;
 
const BranchModel = new Schema({
//  author: ObjectId,
  vendorId: String,
  socketId: String,
  coverageDistance: String,
  name: String,
  phone: String,
  city: String,
  country: String,
  status: Boolean,
  date: Date
});

module.exports == mongoose.model('BranchModel', BranchModel);