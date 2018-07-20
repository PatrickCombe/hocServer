var Document  = require('../models');

var document =  function document(socket){


  socket.on('openDoc', (data) => {
    console.log('received openDoc');
    socket.join(data._id);



  })

  socket.on('syncDocument', (data,next)=>{

  socket.to(data._id).emit('syncDocument', data);

  })

  socket.on('highlight', (data,next)=>{

    socket.to(data._id).emit('highlight', data);

  })

  socket.on('cursorMove', selection => {
    console.log('cursor moved')
    socket.broadcast.to(document).emit('receiveNewCursor', selection)
  })


//leave?

// socket.on('disconnect', function(){
//
// 		socket.leave(socket.room);
// 	});

}

module.exports = document;
