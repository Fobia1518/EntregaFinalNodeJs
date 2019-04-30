function chatBot() {
	
	// current user input
	this.input;

	var url;
	var mensaje;
	
	/**
	 * respondTo
	 * 
	 * return nothing to skip response
	 * return string for one response
	 * return array of strings for multiple responses
	 * 
	 * @param input - input chat string
	 * @return reply of chat-bot
	 */
	this.respondTo = function(input) {
	
		this.input = input.toLowerCase();
		
		if(this.match('(buenos dias|hey|hola|hi|hello)(\\s|!|\\.|$)'))
			return "Hola, buenos dias en que podemos ayudarte?";

		if(this.match('(tarjeta de credito|credito|tarjeta|tawejta)(\\s|!|\\.|$)'))
		{
			nombre = "Tarjetas de credito";
			url = "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/rbC74Pxlrdk\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen></iframe>";
			mensaje ="Si necesitas informacion relacionada con tu tarjeta de credito dirijite a esta direccion"+ " ; " + url + " [ " + nombre;
			return mensaje;
		}
		
		if(this.match('what[^ ]* up') || this.match('sup') || this.match('how are you'))
			return "this github thing is pretty cool, huh?";
		
		if(this.match('l(ol)+') || this.match('(ha)+(h|$)') || this.match('lmao'))
			return "what's so funny?";
		
		if(this.match('^no+(\\s|!|\\.|$)'))
			return "don't be such a negative nancy :(";
		
		if(this.match('(cya|bye|see ya|ttyl|talk to you later)'))
			return ["alright, see you around", "good teamwork!"];
		
		if(this.match('(dumb|stupid|is that all)'))
			return ["hey i'm just a proof of concept", "you can make me smarter if you'd like"];
		
		if(this.input == 'noop')
			return;
		
		return input + " what?";
	}

	/*
	*
	* Separacion de mensaje y url
	*
	**/
	this.separarMensaje = function(str) {

		if (str.indexOf(";") > 0)
		{
			var separador  = str.indexOf(";");
	    	var mensaje = str.substring(0, separador-1);
		}
		else
		{
			var mensaje = str;
		}
		
	    return mensaje;
	}

	this.separarUrl = function(str) {
		var len = str.length;
		var separador1  = str.indexOf(";");
		var separador2  = str.indexOf("[");
	    var url = str.substring(separador1 + 1, separador2-1);
	    return url;
	}

	this.separarNombre = function(str) {
		var len = str.length;
		var separador  = str.indexOf("[");
	    var nombre = str.substring(separador + 1, len);
	    return nombre;
	}
	
	/**
	 * match
	 * 
	 * @param regex - regex string to match
	 * @return boolean - whether or not the input string matches the regex
	 */
	this.match = function(regex) {
	
		return new RegExp(regex).test(this.input);
	}
}
