var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
// io is like app variable 
// app.get ==> io.get

io.on('connection',function(socket){
	now=moment();
	console.log('User connected via socket io');
	socket.on('message',function(message){
		console.log('Message received: '+ message.text);
		message.timestamp=now.valueOf();
		io.emit('message',message);
		//socket.broadcast.emit('message',message);
	});
	//console.log(typeof (now.valueOf()));
	socket.emit('message',{
		text: 'Welcome to chat application!',
		timestamp: now.valueOf()
	});
}); // 

app.use(express.static(__dirname+'/public'));
http.listen(PORT,function(){
	console.log('Server Started!');
});