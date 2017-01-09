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



  var seed_colors =
  ['#2879ff', '#ffd700', '#007a73', '#ed005c', '#fbfbfb', '#d1eb34',
   '#00ff12', '#f59a45', '#189f66', '#00a9cf', '#5421b3', '#961c53',
   '#e6a8ff', '#a5ee8f', '#9a9a9a', '#c700ff', '#63ecc3', '#ff94c0',
   '#ff7340', '#11f4dc', '#915f42', '#93bbc9', '#f2ff00', '#f5c0c0',
   '#23bd20', '#ff0000', '#ff00cf', '#dd500b', '#ff6300', '#2405e4'];


// ### SOCKET.IO CLIENT SIDE ### //

  // set socket location, e.g. io.connect('http://localhost:8000'); || io.connect('http://www.domain_name.com');
  socket = io.connect([location.protocol, '//', location.host].join(''));

  // this socket is sent from the server when the client first connects
  // or when the remote sends the 'change_grid' socket
  socket.on('set_columns_and_rows', function (data) {
    columns = data.wrapper_columns;
    rows = data.wrapper_rows;

    // reposition all boxes
    reposition_all_boxes();
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

  socket.on('seed_canvas', function (data) {
    clear_all_boxes();
    seed_some_boxes(data.seed_number);
  });




  // socket to reset the page
  socket.on('reset_page', function () {
    // could remove all the elements, close all the divs, and check all the variables, or...
    window.location.reload(true);
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

  // reposition all boxes on the page
  function reposition_all_boxes() {

    // set name_box size
    name_box_width = (mainwide / columns),
    name_box_height = (mainhigh / rows);

    // get the boxes
    color_box_elements = document.getElementsByClassName('floating_color_box');

    // loop through each box
    var i = 0;
    while (i < color_box_elements.length) {

      // get the new count from the id
      var count = color_box_elements[i].getAttribute('id');

      // resize the box
      color_box_elements[i].style.width = name_box_width + 'px';
      color_box_elements[i].style.height = name_box_height + 'px';

      // position the box in a grid
      // the row is equal to the remainder of count / rows
      color_box_elements[i].style.top = (count % rows) * name_box_height + 'px';
      //  // the column is equal to the quotient, rounded down
      color_box_elements[i].style.left = ( Math.floor(count / rows) * name_box_width) + 'px';

      i++;
    };
  };

  function clear_all_boxes() {

    $('.floating_color_box').remove();

  };


  // call this function to auto-generate boxes
  function seed_some_boxes(num) {
    for (var i = 0; i <= num; i++) {
      create_colored_box_in_dom((i % seed_colors.length).toString() + seed_colors[i % seed_colors.length], seed_colors[i % seed_colors.length], i);
    };
  };

  // listen for resize and orientation changes and make adjustments
  // TO ADD: change positions and sizes of all boxes
  window.addEventListener('resize', function () {
    mainwide = window.innerWidth;
    mainhigh = window.innerHeight;

    // set wrapper size
    document.getElementById('wrapper').style.width = window.innerWidth + 'px',
    document.getElementById('wrapper').style.height = window.innerHeight + 'px';

    reposition_all_boxes();

  }, false); // bubbling phase

}); // end of document.ready
