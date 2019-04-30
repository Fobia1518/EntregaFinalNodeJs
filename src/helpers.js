const fs = require('fs');
const hbs = require('hbs');
const fun = require('./funciones.js');

hbs.registerHelper('listar', () => {
	listaEstudiantes = require('../data/listado.json');
	let texto = `<table class="table">
					<thead class="thead-dark">
						<th> ID </th>
						<th> Nombre </th>
						<th> Correo </th>
						<th> Telefono </th>
						<th> Tipo </th>
						<th> </th>
					</thead>
					<tbody>
				`;
	listaEstudiantes.forEach(estudiante => {
		let url = Object.entries(estudiante).map(([key, val]) => `${key}=${val}`).join('&');
		texto = texto +
			'<tr>' +
			'<td>' + estudiante.id + '</td>' +
			'<td>'  + estudiante.nombre + '</td>' +
			'<td>'  + estudiante.correo + '</td>' +
			'<td>'  + estudiante.telefono + '</td>' +
			'<td>'  + estudiante.tipo + '</td>' +
			'<td><a href="/registrarUsuario?acc=actualizar&'+url+'">Editar</a></td></tr>';
	});
	texto = texto + '</tbody></table>';
	return texto;
});

hbs.registerHelper('mostrarCursos',(rutaFile, tipo, buscar = false) =>{
	let respuesta = 'No se encontraron datos.';
	let msjExtra = '';
	let data = '';
	if (fs.existsSync(rutaFile)) {
		data = require(rutaFile);
	}

	if (data != '') {
		respuesta = '<table class="table">';
		if (tipo == 'cursosCoordinador') {
			respuesta += `<thead class="thead-dark">
				<tr>
					<th scope="col">#</th>
					<th scope="col">Nombre Curso</th>
					<th scope="col">Modalidad</th>
					<th scope="col">Intensidad Horaria</th>
					<th scope="col">Valor</th>
					<th scope="col">Descripci&oacute;n</th>
					<th scope="col">Estado</th>
					<th scope="col"></th>
				</tr>
			</thead>
			<tbody>`;

			data.forEach((curso) => {
				let url = Object.entries(curso).map(([key, val]) => `${key}=${val}`).join('&');
				respuesta += '<tr>'+
					'<td>'+curso.txt_id_curso+'</td>'+
					'<td>'+curso.txt_nombre_curso+'</td>'+
					'<td>'+curso.lst_modalidad+'</td>'+
					'<td>'+curso.txt_intensidad+'</td>'+
					'<td>'+curso.txt_valor+'</td>'+
					'<td>'+curso.txa_descripcion+'</td>'+
					'<td>'+curso.lst_estado+'</td>'+
					'<td><a href="/Coordinador/frmCursos?acc=actualizar&'+url+'">Editar</a>|'+
					'<a href="/Coordinador/lstCursosInscritos?acc=ver&idCurso='+curso.txt_id_curso+'">Inscritos</a></td>'+
				'</tr>';
			});
			respuesta += '</tbody>';
		}else if (tipo == 'cursosDocente') {
			respuesta += `<thead class="thead-dark">
				<tr>
					<th scope="col">#</th>
					<th scope="col">Nombre Curso</th>
					<th scope="col">Modalidad</th>
					<th scope="col">Intensidad Horaria</th>
					<th scope="col">Descripci&oacute;n</th>
					<th scope="col">Estado</th>
					<th scope="col"></th>
				</tr>
			</thead>
			<tbody>`;
			data = data.filter(buscarCurso => (buscarCurso.lst_docente == buscar.id));
			if (fun.isEmpty(data)) {
				msjExtra = '<p>No tienes cursos asociados.</p>';
			}
			data.forEach((curso) => {
				let url = Object.entries(curso).map(([key, val]) => `${key}=${val}`).join('&');
				respuesta += '<tr>'+
					'<td>'+curso.txt_id_curso+'</td>'+
					'<td>'+curso.txt_nombre_curso+'</td>'+
					'<td>'+curso.lst_modalidad+'</td>'+
					'<td>'+curso.txt_intensidad+'</td>'+
					'<td>'+curso.txa_descripcion+'</td>'+
					'<td>'+curso.lst_estado+'</td>'+
					'<td><a href="/Docente/lstCursosInscritos?acc=ver&idCurso='+curso.txt_id_curso+'">Inscritos</a></td>'+
				'</tr>';
			});
			respuesta += '</tbody>';
		}else if(tipo == 'misCursosAspirante'){
			respuesta += `<thead class="thead-dark">
				<tr>
					<th scope="col">Nombre Curso</th>
					<th scope="col">Valor</th>
					<th scope="col">Descripci&oacute;n</th>
					<th scope="col"></th>
				</tr>
			</thead>
			<tbody>`;

			data.forEach((misCurso) => {
				if (misCurso.id_estudiante == buscar.id) {
					let url = Object.entries(misCurso).map(([key, val]) => `${key}=${val}`).join('&');
					respuesta += '<tr>'+
						'<td>'+misCurso.txt_nombre_curso+'</td>'+
						'<td>'+misCurso.txt_valor+'</td>'+
						'<td>'+misCurso.txa_descripcion+'</td>'+
						'<td><a href="/Aspirante/lstMisCursos?acc=eliminar&'+url+'">Eliminar</a></td>'+
					'</tr>';
				}
			});
			respuesta += '</tbody>';
		}else if(tipo == 'CursosInscritosCoordinador'){
			respuesta += `<thead class="thead-dark">
				<tr>
					<th scope="col">Cedula</th>
					<th scope="col">Nombre</th>
					<th scope="col">N&uacute;mero Contacto</th>
					<th scope="col">Correo</th>
					<th scope="col"></th>
				</tr>
			</thead>
			<tbody>`;
			data = data.filter(buscarCurso => (buscarCurso.txt_id_curso == buscar.id_curso));
			if (fun.isEmpty(data)) {
				msjExtra = '<p>No hay estudiantes inscritos.</p>';
			}
			data.forEach((curso) => {
				fileEstudiantes = rutaFile.replace('dataCursosInscritos.json', '')+'listado.json';
				let dataEstudiante = fun.consultarData(fileEstudiantes, tipo, curso);
				msjExtra = '<h1>Curso: '+curso.txt_nombre_curso+'</h1>'
				respuesta += '<tr>'+
					'<td>'+dataEstudiante.id+'</td>'+
					'<td>'+dataEstudiante.nombre+'</td>'+
					'<td>'+dataEstudiante.telefono+'</td>'+
					'<td>'+dataEstudiante.correo+'</td>'+
					'<td><a href="/Coordinador/lstCursosInscritos?acc=eliminar&idCurso='+curso.txt_id_curso+'&id_estudiante='+curso.id_estudiante+'">Eliminar</a></td>'+
				'</tr>';
			});
			respuesta += '</tbody>';
		}else if(tipo == 'CursosInscritosDocente'){
			respuesta += `<thead class="thead-dark">
				<tr>
					<th scope="col">Cedula</th>
					<th scope="col">Nombre</th>
					<th scope="col">N&uacute;mero Contacto</th>
					<th scope="col">Correo</th>
				</tr>
			</thead>
			<tbody>`;
			data = data.filter(buscarCurso => (buscarCurso.txt_id_curso == buscar.id_curso));
			if (fun.isEmpty(data)) {
				msjExtra = '<p>No hay estudiantes inscritos.</p>';
			}
			data.forEach((curso) => {
				fileEstudiantes = rutaFile.replace('dataCursosInscritos.json', '')+'listado.json';
				let dataEstudiante = fun.consultarData(fileEstudiantes, tipo, curso);
				msjExtra = '<h1>Curso: '+curso.txt_nombre_curso+'</h1>'
				respuesta += '<tr>'+
					'<td>'+dataEstudiante.id+'</td>'+
					'<td>'+dataEstudiante.nombre+'</td>'+
					'<td>'+dataEstudiante.telefono+'</td>'+
					'<td>'+dataEstudiante.correo+'</td>'+
				'</tr>';
			});
			respuesta += '</tbody>';
		}else{
			respuesta += `<thead class="thead-dark">
				<tr>
					<th scope="col">Nombre Curso</th>
					<th scope="col">Valor</th>
					<th scope="col">Descripci&oacute;n</th>
					<th scope="col"></th>
				</tr>
			</thead>
			<tbody>`;

			data.forEach((curso) => {
				if (curso.lst_estado == 'Activo') {
					let url = Object.entries(curso).map(([key, val]) => `${key}=${val}`).join('&');
					respuesta += '<tr>'+
						'<td>'+curso.txt_nombre_curso+'</td>'+
						'<td>'+curso.txt_valor+'</td>'+
						'<td>'+curso.txa_descripcion+'</td>';
					if (tipo == 'cursosNoAspirante') {
						respuesta +='<td><a href="/Aspirante/frmCursos?acc=ver&'+url+'">Ver</a></td>';
					}else if(tipo == 'cursosAspirante'){
						respuesta +='<td><a href="/Aspirante/frmCursos?acc=inscribir&'+url+'">Inscribir</a></td>';
					}
					respuesta += '</tr>';
				}
			});
			respuesta += '</tbody>';
		}

		respuesta += '</table>';
	}
	return msjExtra+respuesta;

});

hbs.registerHelper('ifCond', (v1, operator, v2, options) => {
    switch (operator) {
        case '==':
            return ((v1 == v2) ? options.fn(this) : options.inverse(this));
        case '===':
            return ((v1 === v2) ? options.fn(this) : options.inverse(this));
        case '!=':
            return ((v1 != v2) ? options.fn(this) : options.inverse(this));
        case '!==':
            return ((v1 !== v2) ? options.fn(this) : options.inverse(this));
        case '<':
            return ((v1 < v2) ? options.fn(this) : options.inverse(this));
        case '<=':
            return ((v1 <= v2) ? options.fn(this) : options.inverse(this));
        case '>':
            return ((v1 > v2) ? options.fn(this) : options.inverse(this));
        case '>=':
            return ((v1 >= v2) ? options.fn(this) : options.inverse(this));
        case '&&':
            return ((v1 && v2) ? options.fn(this) : options.inverse(this));
        case '||':
            return ((v1 || v2) ? options.fn(this) : options.inverse(this));
        default:
            return options.inverse(this);
    }
});

hbs.registerHelper('consultarDocentes', (rutaFile, buscar = false) => {
	let data = false;
    let options = '<option value="">Seleccione</option>';
	
	if (fs.existsSync(rutaFile)) {
		data = require(rutaFile);
	}

	if (data !== false) {
		data = data.filter(buscarDocente => (buscarDocente.tipo == 'docente'));

		data.forEach((docentes) => {
			let selected = '';
			if (docentes.id == buscar) {
				selected = 'selected';
			}
			options += '<option '+selected+' value="'+docentes.id+'">'+docentes.nombre+'</option>';
		});

	}

	return options;
});