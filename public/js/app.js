var socket = io();

socket.on('connect', function() {
	console.log('connected to socket io server!');
});

socket.on('message', function(message) {
	var timestampMoment=moment.utc(message.timestamp);
	console.log('New message: ');
	console.log(message.text);
	console.log(timestampMoment.local().format('h:mm a'));

	jQuery('.messages').append('<p><strong>'+timestampMoment.local().format('h:mm a')+': </strong>' + message.text + '</p>')
});

/*
 handles submitting of new messages 
 */

var $form = jQuery('#message-form');
$form.on('submit', function(event) {
	event.preventDefault();
	socket.emit('message', {
		text: $form.find('input[name=message]').val()
	});
	$form.find('input[name=message]').val('');
});