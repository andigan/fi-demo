$(document).ready( function () {

// ### SET PAGE VARIABLES ### //

  // maximum row/column values
  var max_rows_columns = 50;

  // set wrapper size
  document.getElementById('wrapper').style.width = window.innerWidth + 'px';
  document.getElementById('wrapper').style.height = window.innerHeight + 'px';

// ### SOCKET.IO CLIENT SIDE ### //

  // set socket location
  var socket = io.connect([location.protocol, '//', location.host].join(''));

// ### TASK BUTTONS TO SOCKETS ### //

  $('#task1_button').on('click', function () {
    socket.emit('remote_task1_start');
  });

  $('#task2_button').on('click', function () {
    socket.emit('remote_task2_start');
  });

  $('#task3_button').on('click', function () {
    socket.emit('remote_task3_start');
  });

  $('#task4_button').on('click', function () {
    socket.emit('remote_task4_reset');
  });

  // ### REASSIGN GRID BUTTON ### //

  var row_options = '';
  var column_options = '';

  // prepare HTML string for remote html
  for (i = 1; i <= max_rows_columns; i++){
    row_options += '<option val=' + i + '>' + i + '</option>';
    column_options += '<option val=' + i + '>' + i + '</option>';
  };

  // add the HTML string to the form on the DOM
  document.getElementById('row_options').innerHTML = row_options;
  document.getElementById('column_options').innerHTML = column_options;

  // when the change_grid_form is submitted...
  $('#change_grid_form').submit(function () {

    // prepare the socketdata object
    this.socketdata = {};

    this.socketdata.wrapper_columns = document.getElementById('column_options').value;
    this.socketdata.wrapper_rows = document.getElementById('row_options').value;

    // send the socket to the server to relay to the canvas and client
    socket.emit('change_grid', this.socketdata);

    return false;
  });

}); // end of document.ready
