$(document).ready( function () {


// ### SET PAGE VARIABLES ### //

  // set name box height divisions
  var rows = 12,
      columns = 4;

  // get window size
  var mainwide = window.innerWidth,
      mainhigh = window.innerHeight;

  // get name_box size
  var name_box_width = (window.innerWidth / columns),
      name_box_height = (window.innerHeight / rows);

  // declare a variable for the image_id received from the server
  var image_id = '';

  // set wrapper size
  document.getElementById('wrapper').style.width = mainwide + 'px';
  document.getElementById('wrapper').style.height = mainhigh + 'px';


// ### SUBMIT BUTTON ### //

  // when the name form is submitted...
  $('#name_form').submit(function () {

    // close get_name container
    document.getElementById('get_name_container').classList.remove('get_name_container_is_open');

    // open choose_color container
    document.getElementById('choose_color_container').classList.add('choose_color_container_is_open');

    // get the value of the #name_input textbox
    var input_name = document.getElementById('name_input').value;

    // get an HTMLCollection of elements with 'box_name' as a class
    var box_names = document.getElementsByClassName('box_name');

    // put the form's input_name value into the box_name elements
    for (var i = 0; i < box_names.length; i++) {
      box_names[i].textContent = input_name;
    };

    return false;
  });


// ### PICK COLOR BOX CLICK ### //

  // when a pick_color_box is clicked...
  $('.pick_color_box').on('click', function () {

    // get the id of the selected box
    var chosen_id = this.getAttribute('id'),
        // get the color of the selected box
        chosen_color = $('#' + chosen_id).css('background-color'),
        // get the name of the client
        client_name = this.textContent;

    // declare a socket object
    var socketdata = {};

    // add data to the socket object
    socketdata.chosen_color = chosen_color;
    socketdata.client_name = client_name;


    socketdata = {chosen_color: chosen_color; client_name: client_name;}


    // send a socket to the server with the socketdata
    socket.emit('add_to_page', socketdata);

    // close choose_color container
    document.getElementById('choose_color_container').style.display = 'none';
    document.getElementById('choose_color_container').classList.remove('choose_color_container_is_open');
  });



// ### SOCKET.IO CLIENT SIDE ### //

// --Socket.io
//     These functions receive an emit from the server,
//     recognize its name, receive its data, and do something with the data.
//
//     socket.on('broadcast_name', function(data) {
//       use data
//     });

  // set socket location : io.connect('http://localhost:8000'); || io.connect('http://www.domain_name.com');
  var socket = io.connect([location.protocol, '//', location.host, location.pathname].join(''));

  // when the socket name is received from the server...
  socket.on('task1_start', function () {
    // open the get_name_container
    document.getElementById('get_name_container').classList.add('get_name_container_is_open');
  });

  socket.on('task2_start', function () {
    // make the .floating_color_box draggable
    assigndrag('.floating_color_box');
  });


  socket.on('task3_start', function () {
    // activate listening for device orientation data
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', orientationHandler, false);
    };

  });

  // this function is used when the listener is activated above
  function orientationHandler(e) {
    socketdata = {};
    socketdata.image_id = image_id;

    socketdata.transform_string = 'perspective(500) rotateZ(' + e.alpha + 'deg) rotateX(' + (e.beta) + 'deg) rotateY(' + e.gamma + 'deg)';
    socket.emit('client_transforming', socketdata);
  }




  // create the box in the client, using the name, color, and box_number data
  socket.on('add_to_client', function (data) {
    create_colored_box_in_dom(data.client_name, data.chosen_color, data.box_number);
    // assign the client's image_id to the box_count so that it matches the canvas id
    image_id = data.box_number;
  });


// ### DRAGGABLE METHOD FROM jquery.ui ### //

  function assigndrag(id) {

    $(id).draggable(
      {
        containment: 'window',
        scroll: true,
        start:  function () {
          // begin to prepare socketdata
          this.socketdata = {};
          this.socketdata.image_id = this.getAttribute('id');
        },
        drag: function () {
          // this will give the percentage location on the client's page
          // rather than the direct pixel count
          this.socketdata.top_percent = (parseInt(this.style.top) / mainhigh).toFixed(2);
          this.socketdata.left_percent = (parseInt(this.style.left) / mainwide).toFixed(2);

          // pass socket object to server
          socket.emit('client_moving', this.socketdata);
        }
      });
  };


// ### PAGE HELPERS ### //

  // create colored box in DOM
  function create_colored_box_in_dom(name, color, count) {
    var images_element = document.getElementById('wrapper'),
        box_element = document.createElement('div');

    box_element.setAttribute('id', count);
    box_element.classList.add('floating_color_box');
    box_element.style.width = name_box_width + 'px';
    box_element.style.height = name_box_height + 'px';

    // position the box in a grid
    // the row is equal to the remainder of count / rows
    box_element.style.top = ( (count % rows) * name_box_height) + 'px';
    // the column is equal to the quotient, rounded down
    box_element.style.left = ( Math.floor(count / rows) * name_box_width) + 'px';

    box_element.style.backgroundColor = color;
    box_element.textContent = name;

    // add box_element to wrapper
    images_element.appendChild(box_element);
  };


  // prevent default behavior to prevent iphone dragging and bouncing
  // http://www.quirksmode.org/mobile/default.html
  document.ontouchmove = function (event) {
    event.preventDefault();
  };

  // listen for resize and orientation changes and make adjustments
  // TO ADD: change positions and sizes of all boxes
  window.addEventListener('resize', function () {
    mainwide = window.innerWidth;
    mainhigh = window.innerHeight;

    // set name_box size
    name_box_width = (window.innerWidth / columns);
    name_box_height = (window.innerHeight / rows);

    // set wrapper size
    document.getElementById('wrapper').style.width = window.innerWidth + 'px',
    document.getElementById('wrapper').style.height = window.innerHeight + 'px';
  }, false); // bubbling phase

}); // end of document.ready
