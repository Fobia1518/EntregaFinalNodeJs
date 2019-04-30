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

		if(this.match('(buenos dias|hey|hola|hi|hello|Buenos dias|buenas tardes|buenas noches)(\\s|!|\\.|$)'))
			return "Hola, en que podemos ayudarte?";

		if(this.match('(--help)(\\s|!|\\.|$)'))
			return "Puedes ingresar los siguientes comandos: hola | cursos | materias | tiempo | info | como estas? | adios";

		if(this.match('bien o no') || this.match('como estas?'))
			return "Bien y tu? En que puedo ayudarte?";

		if(this.match('(info|informacion)(\\s|!|\\.|$)'))
		{
			nombre = "Informacion de los cursos";
			url = "<a href=\"/Aspirante/lstCursos\" target=\"_blank\">";
			mensaje ="Si necesitas informacion relacionada con los cursos puedes dirijirte a esta direccion"+ " ; " + url + " [ " + nombre;
			return mensaje;
		}

		if(this.match('(cursos|materias|tiempo)(\\s|!|\\.|$)'))
		{
			nombre = "Cursos";
			url = "<iframe width=\"100%\" height=\"300\" src=\"/Aspirante/lstCursos\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen></iframe>";
			mensaje ="Si necesitas informacion relacionada con tu tarjeta de credito dirijite a esta direccion"+ "<br><br><br>"+ " ; " + url + " [ " + nombre;
			return mensaje;
		}

		if(this.match('(adios|chao|hasta luego)'))
			return ["Hasta luego", "Te esperamos pronto!"];

		return input + "? Que quieres decir? Si deseas informacion ingresa: --help";
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
