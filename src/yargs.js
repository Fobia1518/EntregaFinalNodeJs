const id = {
	demand: true,
	alias: 'i'
}

const nombre = {
	demand: true,
	alias: 'n'
}

const correo = {
	demand: true,
	alias: 'c'
}

const telefono = {
	demand: true,
	alias: 't'
}

const tipo = {
	demand: true,
	alias: 'p'
}

//sirve tambien para actualizar
const creacion = {
	id,
	nombre,
	correo,
	telefono,
	tipo
}

//sirve tambien para eliminacion
const mostrarest = {
	id
}

const argv = require('yargs')
				.command('crear', 'Crear estudiante', creacion)
				.command('mostrar', 'Muestra los estudiantes')
				.command('mostrarest', 'Muestra informacion de un estudiante', mostrarest)
				.command('actualizar', 'Actualizar informacion del estudiantes', creacion)
				.command('eliminar', 'Eliminar informacion del estudiantes', mostrarest)
				.argv;

module.exports = {
	argv
};