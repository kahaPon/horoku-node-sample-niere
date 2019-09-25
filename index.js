var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

io.on('connection', function (socket) {
	socket.on('chat message', function (msg) {
		io.emit('chat message', msg);
		console.log(msg);
	});
});

http.listen(port, function () {
	console.log('listening on *:' + port);
});

//for connection
io.on('connection', (socket) => {
	console.log('New user connected')

	socket.username = "Anonymous"

	socket.on('change_username', (data) => {
		socket.username = data.username
		console.log(socket.username)
	})

	socket.on('log_in', (data) => {
		io.sockets.emit("log_in", data);
	})

	socket.on('request_user', (data) => {
		io.sockets.emit('request_user', data);
	})

	//listen on message

	socket.on('new_message', (data) => {
		io.sockets.emit('new_message', data);
	})

	//listen on typing
	socket.on('typing', (data) => {
		socket.broadcast.emit('typing', data);
	})
})
