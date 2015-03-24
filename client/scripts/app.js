// YOUR CODE HERE:
var friends = {};

var app = {
	server : 'http://127.0.0.1:3000/classes/messages',
	username : 'anonymous',
	roomname : "Lobby",

  init : function(){
		$('#messageBox').focus();
		app.username = window.location.search.substr(10);

		// setInterval(function(){
			app.fetch();
		// }, 500);
	},

  send : function(message){
	  $.ajax({
		  // This is the url you should use to communicate with the parse API server.
		  url: app.server,
		  type: 'POST',
		  data: JSON.stringify(message),
		  contentType: 'application/json',
		  success: function (data) {
		    console.log('chatterbox: Message sent');
		  },
		  error: function (data) {
		    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
		    console.error('chatterbox: Failed to send message');
		  }
		});
	},

  fetch : function(){
		var result = $.ajax({
			  // This is the url you should use to communicate with the parse API server.
			  url: app.server,
			  type: 'GET',
			  contentType: 'application/json',
			  success: function (data) {
			  	debugger;
					console.log(data);
			    console.log('chatterbox: Message received');
			    app.clearMessages();
			    app.updateMessages(data.results);
			  },
			  error: function (data) {
			    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
			    console.error('chatterbox: Failed to receive message');
			  }
			});
		},

  clearMessages : function(){
		$('#chats').children().remove();
	},

  addMessage : function(message){
  	message.username = message.username || "anonymous";
	  if (message.roomname === app.roomname || app.roomname === "Lobby"){
	  	$('#chats').prepend('<div class="chat"></div>');
	  	var $user = $('<div class="username"></div>');
	  	$user.text(message.username).addClass(message.username);
	  	$('#chats').children().first().append($user);
			var $text = $('<div class="message"></div>');
			$text.text(message.text);
	  	$('#chats').children().first().append($text);
	  }

		if(friends[message.username]){
			$('#chats').find('.' + message.username).addClass("friend");
		}

	},

  addRoom : function(roomName){
		$('#roomSelect').append('<option value="' + roomName + '">' + roomName + '</option>');
		app.roomname = roomName;
		$('#roomSelect').val(roomName);
		console.log('current room', roomName);
	},

	addFriend : function(user) {
		if (friends[user] === undefined){
			friends[user] = user;
			$('#chats').find('.' + user).addClass('friend');
		} else {
			friends[user] = undefined;
			$('#chats').find('.' + user).removeClass('friend');
		}
	},

  handleSubmit : function(messageText){
		$('#messageBox').val('');
		var message = new Message(app.username, messageText, app.roomname);
		app.send(message);
	},

  updateMessages : function(data) {
	  for (var i = data.length - 1; i >= 0; i--){
		  var message = new Message(data[i].username, data[i].text, data[i].roomname);
		  	app.addMessage(message);
	  }
	},

  changeRoom : function(roomName){
		$('#chats').find('.chat').addClass('invisible');
		$('#chats').find('.' + app.roomname).removeClass('invisible');
		if(app.roomname === 'Lobby'){
			$('#chats').find('.chat').removeClass('invisible');
		}
	}
};

var Message = function(username, text, roomname){
	this.username = username;
	this.text = text;
	this.roomname = roomname;
}


$(document).ready(function(){
	app.init();

	$('#main').on('click', '.username', function(event){
		var user = $(this).text();
		app.addFriend(user);
	});

	$('form').submit(function(event){
		// debugger;
		event.preventDefault();
		$('#messageBox').focus();
		var messageText = $(this).children('#messageBox').val();
		app.handleSubmit(messageText);
	});

	$('button').click('#addRoom', function(event){
		var newRoomName = prompt("Enter room name:");
		app.addRoom(newRoomName);
		app.changeRoom(newRoomName);
	});

	$('#roomSelect').change(function(event){
		app.roomname = $(this).val();
		app.changeRoom(app.roomname);
	})
});
