var name = getQueryVariable('name')||'Annoymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name+ " joined in "+ room);

socket.on('connect', function() {
	console.log('connected to socket io server!');
});

socket.on('message', function(message) {
	var timestampMoment=moment.utc(message.timestamp);
	console.log('New message: ');
	console.log(message.text);
//	console.log(timestampMoment.local().format('h:mm a'));
	var $message = jQuery('.messages');
	$message.append('<p><strong>' + message.name +' ' + timestampMoment.local().format('h:mm a')+'</strong></p>')
	$message.append('<p>' + message.text + '</p>')
});

/*
 handles submitting of new messages 
 */

var $form = jQuery('#message-form');
$form.on('submit', function(event) {
	event.preventDefault();
	socket.emit('message', {
		name: name,
		text: $form.find('input[name=message]').val()
	});
	$form.find('input[name=message]').val('');
});