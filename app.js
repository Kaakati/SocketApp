var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const port = 8080
const mongoose = require('mongoose');

mongoose.connect('mongodb://admin4:951753@ds055945.mlab.com:55945/kaakatidb');

// Serve Files from Express for Endpoint
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//Whenever someone connects this gets executed
io.on('connection', function(socket){
  console.log('a user connected');
  
  // Find One by ID and Update Status
  socket.on('Status', function(object) {
    console.log(socket.id)
    Vendor.findById(object.id, function (err, result) {
      console.log('Found One by id:');
      console.log(object.id + " " + result.name)
      console.log(object.status)

      var query = { '_id' : object.id };
      Vendor.findOneAndUpdate(query, {'socketId' : socket.id}, {upsert:true}, function(err, doc){
        if (err) return console.log(500, { error: err });
        return console.log("succesfully saved");
      });

    });
  })
  
  // Listen on Get All Vendors request
  socket.on('getAllVendors', function(){
    Vendor.find({}, function(err, docs) {
      if (!err){ 
        // Emit All Vendors as Requested
        docs.forEach(element => {
          socket.emit('allVendors', element);
        });
          console.log(docs);
      } else {throw err;}
    });
  });

  socket.broadcast.emit('broadcastChannel', 'This is a broadcast.' + socket.id);
  
  // Listen for Create a New Vendor Event
  socket.on('createVendor', function(req){
    // create a blog post

    let newVendor = {
      name: req.name
    }
    return Vendor.create(newVendor);    

  });

  //Whenever someone disconnects this piece of code is executed
  socket.on('disconnect', function () {
    console.log('===================');
    console.log('A user disconnected');
    
    // Find The Socket that is Disconnected
    var query = { 'socketId' : socket.id };
    // Update the Socket with "" and set Status to 0
    var toUpdate = {'socketId' : "", 'status' : 0};
    
    Vendor.findOneAndUpdate(query, toUpdate, {upsert:false}, function(err, doc){
      if (err) {
        console.log(500, { error: err });
      } else {
        console.log(doc.name)
        console.log(doc.status)
        // Print out the name of the disconnected
        console.log("succesfully disconnected user" + " " + doc.name);
      }
    });
 });
});

// Listen on Port 8080 for HTTP and Socket
http.listen(port, function(){
  console.log('listening on *:' + port);
});

// Mongoose Schema
const Schema = mongoose.Schema;
    // ObjectId = Schema.ObjectId;
 
const VendorModel = new Schema({
//  author: ObjectId,
  name: String,
  phone: String,
  city: String,
  country: String,
  status: Boolean,
  socketId: String,
  date: Date
});

const Vendor = mongoose.model('VendorModel', VendorModel);

// // Mongoose Schema
// const Schema = mongoose.Schema;
//     // ObjectId = Schema.ObjectId;
 
// const BranchModel = new Schema({
// //  author: ObjectId,
//   vendorId: String,
//   name: String,
//   phone: String,
//   city: String,
//   country: String,
//   status: Boolean,
//   socketId: String,
//   date: Date
// });

// const Branch = mongoose.model('BranchModel', BranchModel);