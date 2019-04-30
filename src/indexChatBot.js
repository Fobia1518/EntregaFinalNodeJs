$(function() {

	// chat aliases
	var you = 'Tu';
	var robot = 'Aprender es facil';
	
	// slow reply by 400 to 800 ms
	var delayStart = 400;
	var delayEnd = 800;
	
	// initialize
	var bot = new chatBot();
	var chat = $('.chat');
	var waiting = 0;
	$('.busy').text(robot + ' escribiendo...');
	
	// submit user input and get chat-bot's reply
	var submitChat = function() {
	
		var input = $('.input input').val();
		if(input == '') return;
		
		$('.input input').val('');
		updateChat(you, input);
		
		var reply = bot.respondTo(input);

		if(reply == null) return;
		
		var latency = Math.floor((Math.random() * (delayEnd - delayStart)) + delayStart);
		$('.busy').css('display', 'block');
		waiting++;
		setTimeout( function() {
			if(typeof reply === 'string') {
				updateChat(robot, reply);
			} else {
				for(var r in reply) {
					updateChat(robot, reply[r]);
				}
			}
			if(--waiting == 0) $('.busy').css('display', 'none');
		}, latency);
	}
	
	// add a new line to the chat
	var updateChat = function(party, text) {
	
		var style = 'you';
		if(party != you) {
			style = 'other';

			if (text.indexOf(";") > 0)
			{
				var msg = bot.separarMensaje(text);
				var url = bot.separarUrl(text);
				var nombre = bot.separarNombre(text);
				//var line = $('<div><span class="party"></span> <span class="text">'+ msg +'<a id="url" class="url" href="'+ url +'">'+ nombre +'</a></span></div>');
				var line = $('<div><span class="party"></span> <span class="text">'+ msg + '<iframe  width="35%" height="100%" src="'+ url +'" frameborder="0" allowfullscreen></iframe>'+ nombre +'</a></span></div>');
				var line = $('<div><span class="party"></span> <span class="text">'+ msg + url + nombre +'</a></span></div>');
				line.find('.party').addClass(style).text(party + ':');
			}
			else
			{
				var line = $('<div><span class="party"></span> <span class="text"></span></div>');
				line.find('.party').addClass(style).text(party + ':');
				line.find('.text').text(text);
			}
		}
		else
		{
			var line = $('<div><span class="party"></span> <span class="text"></span></div>');
			line.find('.party').addClass(style).text(party + ':');
			line.find('.text').text(text);
		}
		
		chat.append(line);
		
		chat.stop().animate({ scrollTop: chat.prop("scrollHeight")});
	
	}
	
	// event binding
	$('.input').bind('keydown', function(e) {
		if(e.keyCode == 13) {
			submitChat();
		}
	});
	$('.input a').bind('click', submitChat);
	
	// initial chat state
	updateChat(robot, 'Bienvenido a aprender es facil Bancolombia!');

});