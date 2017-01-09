$(document).ready( function () {


// ### SET PAGE VARIABLES ### //

  // set name box height divisions
  var rows = 12,
      columns = 4;

  // get window size
  var mainwide = window.innerWidth,
      mainhigh = window.innerHeight;

  // set name_box size
  var name_box_width = (window.innerWidth / columns),
      name_box_height = (window.innerHeight / rows);

  // set wrapper size
  document.getElementById('wrapper').style.width = mainwide + 'px';
  document.getElementById('wrapper').style.height = mainhigh + 'px';


// ### SOCKET.IO CLIENT SIDE ### //

  // set socket location, e.g. io.connect('http://localhost:8000'); || io.connect('http://www.domain_name.com');
  socket = io.connect([location.protocol, '//', location.host].join(''));

  // this socket is sent from the server when the client first connects
  // or when the remote sends the 'change_grid' socket
  socket.on('set_columns_and_rows', function (data) {
    columns = data.wrapper_columns;
    rows = data.wrapper_rows;

    // set name_box size
    name_box_width = (mainwide / columns),
    name_box_height = (mainhigh / rows);
  });

  socket.on('add_to_canvas', function (data) {
    create_colored_box_in_dom(data.client_name, data.chosen_color, data.box_number);
  });

  // on another client moving an image, move target using image_id
  socket.on('broadcast_moving', function (data) {

    // position the box in relation to the current window
    document.getElementById(data.image_id).style.top  = (data.top_percent * mainhigh) + 'px';
    document.getElementById(data.image_id).style.left = (data.left_percent * mainwide) + 'px';
  });

  // on another client re-orienting an image, re-orient the target using image_id
  socket.on('broadcast_transforming', function (data) {
    // orientation information
    document.getElementById(data.image_id).style.webkitTransform = data.transform_string;
  });

  // when a client disconnects, remove the associated image_id
  socket.on('client_disconnect', function (data) {
    $('#' + data.disconnect_image_id).remove();
  });


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

}); // end of document.ready
