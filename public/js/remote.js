$(document).ready( function () {

// ### SET PAGE VARIABLES ### //

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

}); // end of document.ready
