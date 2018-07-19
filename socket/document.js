var Document  = require('../models');

var document =  function document(socket){


  socket.on('openDoc', (data) => {
    console.log('received openDoc');
    socket.join(data._id);
    // next(data._id);
  })

  socket.on('syncDocument', (data,next)=>{
    socket.to(data._id).emit('syncDocument', data);
  })
}

module.exports = document;
