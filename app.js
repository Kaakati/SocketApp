var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const mongoose = require('mongoose');
const port = 8080

mongoose.connect('mongodb://admin4:951753@ds055945.mlab.com:55945/kaakatidb');

// All Sockets
var allClients = [];

// Models
var Vendor = require('./models/vendor');
var Branch = require('./models/branch');
var Order = require('./models/order');
var OrderItems = require('./models/orderItems');
// var User = require('./models/user');
// var Driver = require('./models/driver');

// Logic
// Serve Files from Express for Endpoint
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/1', function(req, res){
  res.sendFile(__dirname + '/tonino.html');
});

app.get('/2', function(req, res){
  res.sendFile(__dirname + '/snacku.html');
});

//Whenever someone connects this gets executed
io.on('connection', function(socket){
  console.log('a user connected');

  allClients.push(socket);

  // Find One by ID and Update Status
  socket.on('Status', function(object) {
    console.log(socket.id)
    Vendor.findById(object.id, function (err, result) {
      console.log('Found One by id:');
      console.log(object.id + " " + result.name)
      console.log('is Online:' + ' ' + object.status)

      var query = { '_id' : object.id };
      var toUpdate = {'socketId' : socket.id, 'status': 1};
      Vendor.findOneAndUpdate(query, toUpdate, {upsert:false}, function(err, doc){
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

  console.log('Connected Users' + ' ' + allClients.length);

  //Whenever someone disconnects this piece of code is executed
  socket.on('disconnect', function () {
    console.log('===================');
    console.log('A user disconnected' + ' ' + socket.id);
    
    
    var i = allClients.indexOf(socket);
    allClients.splice(i, 1);
    console.log(allClients.length);

    // Find The Socket that is Disconnected
    var query = { 'socketId' : socket.id };
    // Update the Socket with "" and set Status to 0
    var updateStatus = {'socketId' : "", 'status' : false};
    // Find by Socket
    
    // Find Socket by ID and Update Status
    Vendor.findOneAndUpdate(query, {'status' : 0}, {upsert:false}, function(err, vendor){
      if (err) {
        console.log(500, { error: err });
      } else {
        // console.log('is Online:' + ' ' + vendor.status)
        console.log('=============DISCONNECTED==============')
        // Print out the name of the disconnected
        // console.log("succesfully disconnected user" + " " + vendor.id);
      }
    });

    // Vendor.find(query, function(err, doc){
    //   if (err) {
    //     console.log(500, { error: err });
    //   } else {
    //     // console.log('=============DISCONNECTED==============')
    //     // console.log('is Online:' + ' ' + doc.status)
    //     // // Print out the name of the disconnected
    //     // console.log("succesfully disconnected user" + " " + doc.id);
    //   }
    // });
 });
});

// Listen on Port 8080 for HTTP and Socket
http.listen(port, function(){
  console.log('listening on *:' + port);
});

