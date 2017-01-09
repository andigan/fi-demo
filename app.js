// ################################################################## //
// set up server
var config = require('./config/config.js'), // import config variables
    port = config.port,                     // set the port
    express = require('express'),           // use express as the framwork
    app = express(),                        // create the server using express
    nunjucks = require('nunjucks'),         // require the templating engine
    path = require('path');                 // utility module

app.set('views', path.join(__dirname, 'views')); // express method to set the 'views' directory using a string.
nunjucks.configure(path.join(__dirname, 'views'), { autoescape: true, express: app }); // set up templating engine
app.use(express.static(path.join(__dirname, 'public'))); // this middleware serves static files, such as .js, .img, .css files

// Initialize server
var server = app.listen(port, function () {
  console.log('Listening on port %d', server.address().port);
});
// ################################################################## //


// initialize default columns and rows for client and canvas
var rows = 12,
    columns = 4;

// # ROUTING FUNCTIONS # //

app.get('/remote', function (req, res) {

  res.render('remote.html', {
    title : 'remote control'
  });
});

app.get('/', function (req, res) {

  res.render('client.html', {
    title : 'client page'
  });
});

app.get('/canvas', function (req, res) {
  res.render('canvas.html', {
    title : 'canvas page'
  });
});


// ##### SOCKET.IO ##### //

// global variable: number of boxes added
var box_number = 0;

// Initialize server-side socket.io
var io = require('socket.io').listen(server);



// an instance of this function and its variables are created for each client connected
io.on('connection', function (socket) {
  var image_id = '';

  socket.emit('set_columns_and_rows', {wrapper_columns: columns, wrapper_rows: rows});


// incoming remote control sockets
  socket.on('remote_task1_start', function () {
    socket.broadcast.emit('task1_start');
  });

  socket.on('remote_task2_start', function () {
    socket.broadcast.emit('task2_start');
  });

  socket.on('remote_task3_start', function () {
    socket.broadcast.emit('task3_start');
  });

  socket.on('remote_task4_reset', function () {
    box_number = 0;
  });

  socket.on('change_grid', function (data) {
    columns = data.wrapper_columns;
    rows = data.wrapper_rows;
    socket.broadcast.emit('set_columns_and_rows', data);
  });


// incoming client sockets
  socket.on('add_to_page', function (data) {
    // store the client's image_id
    image_id = box_number;

    // add the position number to the data
    data.box_number = box_number;

    // send a socket back to the client to add to page
    socket.emit('add_to_client', data);

    // send a socket to the canvas
    socket.broadcast.emit('add_to_canvas', data);

    box_number++;
  });


  // socket to share image movements
  socket.on('client_moving', function (data) {
    socket.broadcast.emit('broadcast_moving', data);
  });

  // socket to share image orientation
  socket.on('client_transforming', function (data) {
    socket.broadcast.emit('broadcast_transforming', data);
  });


  // this fires when the client disconnects
  socket.on('disconnect', function () {
    // remove the image_id from the canvas
    socket.broadcast.emit('client_disconnect', {disconnect_image_id: image_id });
  });

});


module.exports = app;
