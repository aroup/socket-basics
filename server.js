var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// io is like app variable 
// app.get ==> io.get

io.on('connection',function(){
	console.log('User connected via socket io');
}); // 

app.use(express.static(__dirname+'/public'));
http.listen(PORT,function(){
	console.log('Server Started!');
});