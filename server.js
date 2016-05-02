var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
// io is like app variable 
// app.get ==> io.get
var clientInfo = {};
//data gets stored in key value pair !

// sends current users to provided socket

function sendCurrentUsers(socket){
	var info = clientInfo[socket.id];
	var users=[];

	if(typeof info=='undefined'){
		return ;
	}

	Object.keys(clientInfo).forEach(function(socketId){
		var userInfo = clientInfo[socketId];
		if(info.room == userInfo.room){
			users.push(userInfo.name);
		}
	});

	socket.emit('message',{
		name: 'System',
		text: 'current users: '+ users.join(', '),
		timestamp: moment().valueOf()
	});
}

io.on('connection', function(socket) {
	now = moment();
	console.log('User connected via socket io');
	socket.on('disconnect', function() {
		var userData = clientInfo[socket.id];
		if (typeof userData != 'undefined') {
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left!',
				timestamp: moment.valueOf()
			});
			delete clientInfo[socket.id];
		}
	});
	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has Joined!',
			timestamp: moment().valueOf()
		});
	});

	socket.on('message', function(message) {
		console.log('Message received: ' + message.text);
		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else {
			message.timestamp = now.valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message);
		}

		//socket.broadcast.emit('message',message);
	});
	//console.log(typeof (now.valueOf()));
	socket.emit('message', {
		name: 'System',
		text: 'Welcome to chat application!',
		timestamp: now.valueOf()
	});
}); // 

app.use(express.static(__dirname + '/public'));
http.listen(PORT, function() {
	console.log('Server Started!');
});