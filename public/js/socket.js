console.log('io');
socket = io();

socket.on("mensaje", (informacion) => {
	console.log(informacion)
});

socket.emit("contador");

socket.on("contador", (contador) => {
	console.log(contador)
});