var dataFiles = {
	'dataCursos': 'dataCursos.json',
	'dataCursosIns': 'dataCursosInscritos.json',
	'usuarios': 'listado.json'
};

const fs = require('fs');
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
const sgMail = require('@sendgrid/mail');
var db = "";
var	clln_usuarios = "";
var	clln_cursos = "";
var	clln_usuariosCursos = "";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
var dataCursos = [];
var dataMisCursos = [];

/*fabian*/
const path = require('path');
const pathdata =  path.join(__dirname, '../data');
listaEstudiantes = [];
/*fabian*/

/********************************************** DataBase**********************************************************/
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const MONGODB_URI = process.env.MONGODB_URI || "";

// Database Name
const dbName = 'cursonodejs';

// Create a new MongoClient
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true });

// Use connect method to connect to the Server
client.connect(function(err) {
	if (err)
	{
		return console.log("No ha sido posible la conexion");
	}

	console.log("Conectado BD");

	//Collection
	db = client.db(dbName);
	clln_usuarios = db.collection('clln_usuarios');
	clln_cursos = db.collection('clln_cursos');
	clln_usuariosCursos = db.collection('clln_usuariosCursos');

	clln_usuarios.find({}).toArray(function (err, result) {
		listaEstudiantes = result;
		fs.writeFile(pathdata+'\\'+dataFiles.usuarios, JSON.stringify(result), (err) => {
			if (err){
				console.log(err);
			}
			return false;
		});
	});

	clln_cursos.find({}).toArray(function (err, result) {
		dataCursos = result;
		fs.writeFile(pathdata+'\\'+dataFiles.dataCursos, JSON.stringify(result), (err) => {
			if (err){
				console.log(err);
			}
			return false;
		});
	});

	clln_usuariosCursos.find({}).toArray(function (err, result) {
		dataMisCursos = result;
		fs.writeFile(pathdata+'\\'+dataFiles.dataCursosIns, JSON.stringify(result), (err) => {
			if (err){
				console.log(err);
			}
			return false;
		});
	});

});
/********************************************** DataBase**********************************************************/

var isEmpty = (obj) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
var guardarData = (rutaFile, data, tipoData) => {
	if (tipoData == 'cursosCoordinador') {
		if (data) {
			clln_cursos.insertOne(JSON.parse(JSON.stringify(data))
				, (err, result) => {
					if(err)
					{
						return console.log("Error ingresando curso. Error: " + err);
					}
					return console.log("Curso Guardado");
				}
			);
			dataCursos.push(data);
		}
		data = dataCursos;
	}
	if (tipoData == 'cursosAspirante') {
		if (data) {
			clln_usuariosCursos.insertOne(JSON.parse(JSON.stringify(data))
				, (err, result) => {
					if(err)
					{
						return console.log("Error ingresando el usuario al curso. Error: " + err);
					}
					return console.log("Asignacion guardada correctamente");
				}
			);
			dataMisCursos.push(data);
		}
		data = dataMisCursos;
	}
	if (tipoData == 'datosUsuarios') {
		if (data) {
			listaEstudiantes.push(data);
		}
		data = listaEstudiantes;
	}

	var save = true;
	fs.writeFile(rutaFile, JSON.stringify(data), (err) => {
		if (err){
			save = false;
			throw err;
		}

	});

	return save;
}

var consultarData = (rutaFile, tipoData, buscar = false) => {
	let data = {};
	if (fs.existsSync(rutaFile)) {
		if (tipoData == 'cursosCoordinador') {
			data = dataCursos = require(rutaFile);
		}else if(tipoData == 'cursosAspirante'){
			data = dataMisCursos = require(rutaFile);

		}else{
			data = require(rutaFile);
		}
	}

	if (buscar) {
		if (tipoData == 'cursosCoordinador') {
			data = dataCursos.find(buscarCurso => buscarCurso.txt_id_curso == buscar.txt_id_curso);
		}else if (tipoData == 'cursosAspirante') {
			data = dataMisCursos.find(buscarCurso => (buscarCurso.txt_id_curso == buscar.txt_id_curso && buscarCurso.id_estudiante == buscar.id_estudiante));
		}else if(tipoData == 'CursosInscritosCoordinador'){
			data = data.find(buscarEstudiante => (buscarEstudiante.id == buscar.id_estudiante));
		}else if (tipoData == 'datosUsuarios') {
			data = data.find(buscarUsuario => (buscarUsuario.id == buscar.id));
		}

	}

	return data;
}

var actualizarData = (rutaFile, tipoData, buscar = false) => {
	let editar = consultarData(rutaFile, tipoData, buscar);
	if (tipoData == 'cursosCoordinador') {
		editar.txt_nombre_curso = buscar.txt_nombre_curso;
		editar.lst_modalidad = buscar.lst_modalidad;
		editar.txt_intensidad = buscar.txt_intensidad;
		editar.txt_valor = buscar.txt_valor;
		editar.lst_docente = buscar.lst_docente;
		editar.txa_descripcion = buscar.txa_descripcion;
		editar.lst_estado = buscar.lst_estado;

		clln_cursos.updateOne(
			{txt_id_curso: buscar.txt_id_curso},
			{$set: {
					txt_nombre_curso: buscar.txt_nombre_curso,
					lst_modalidad: buscar.lst_modalidad,
					txt_intensidad: buscar.txt_intensidad,
					txt_valor: buscar.txt_valor,
					lst_docente: buscar.lst_docente,
					txa_descripcion: buscar.txa_descripcion,
					lst_estado: buscar.lst_estado
				}	
			},
			(err, result) => {
				if(err)
				{
					return console.log("Error actualizando el curso. Error: " + err);
				}
				return console.log("Curso actualizado");
			}
		);
	}else if(tipoData == 'datosUsuarios'){
		editar.nombre = buscar.nombre;
		editar.correo = buscar.correo;
		editar.telefono = buscar.telefono;
		editar.tipo = buscar.tipo;

		clln_usuarios.updateOne(
			{id: parseInt(buscar.id)},
			{$set: { 
				nombre: buscar.nombre,
				correo: buscar.correo,
				telefono: parseInt(buscar.telefono),
				tipo: buscar.tipo }},
			(err, result) => {
				if(err)
				{
					return console.log("Error actualizando estudinte. Error: " + err);
				}
				return console.log("Estudiante actualizado");
			}
		);

	}
	return guardarData(rutaFile, false, tipoData);

}

/*fabian*/
const crear = (estudiante) => {
	listar();
	let est = {
		id: estudiante.id,
		nombre: estudiante.nombre,
		correo: estudiante.correo,
		telefono: estudiante.telefono,
		tipo: estudiante.tipo
	};
	let duplicado = listaEstudiantes.find(varest => varest.id == estudiante.id)
	if (!duplicado){
		listaEstudiantes.push(est);
		guardar('creado', est);
	}
	
};

const listar = () => {
	try
	{
		listaEstudiantes = require('../data/listado.json'); //data
		
	}
	catch (error)
	{
		listaEstudiantes = [];
	}
}

const guardar = (men, creacionUsuario = false) => {
	let datos = JSON.stringify(creacionUsuario);
	clln_usuarios.insertOne(
			JSON.parse(datos)
		, (err, result) => {
			if(err)
			{
				console.log("Error ingresando usuario. Error: " + err);
			}
			else
			{
				console.log("Guardado en BD");
				console.log(result.ops);
				msg = {
						to: creacionUsuario.correo,
						from: 'jhonfvs852@gmail.com',
						subject: 'Registro',
						text: 'Sr.'+creacionUsuario.nombre+' lo han registrado correctamente a la plataforma de cursos del proyecto de node.js',
						html: '<strong>Sr.'+creacionUsuario.nombre+' lo han registrado correctamente a la plataforma de cursos del proyecto de node.js</strong>',
					};
					sgMail.send(msg);
					let coordinadores = listaEstudiantes.filter(buscar => buscar.tipo == 'Coordinador');
					coordinadores.forEach((coordinador)=>{
						msg = {
							to: coordinador.correo,
							from: 'jhonfvs852@gmail.com',
							subject: 'Registro Usuario',
							text: 'Sr.'+creacionUsuario.nombre+' el usuario '+creacionUsuario.nombre+' identificado con '+creacionUsuario.id+' se ha registrado correctamente a la plataforma de cursos del proyecto de node.js',
							html: '<strong>Sr.'+creacionUsuario.nombre+' el usuario '+creacionUsuario.nombre+' identificado con '+creacionUsuario.id+' se ha registrado correctamente a la plataforma de cursos del proyecto de node.js</strong>',
						};
						sgMail.send(msg);
				});
			}
	});
	fs.writeFile(pathdata + '/listado.json', JSON.stringify(listaEstudiantes), (error)=>{
		if (error) throw (error);
			console.log('Estudiante ' + men + ' con exito');
	});
}

const mostrar = () => {
	listar();
	console.log('Estudiantes inscritos\n')
	listaEstudiantes.forEach(estudiante => {
		console.log('Estudiante')
		console.log('ID: ' + estudiante.id)
		console.log('Nombre: ' + estudiante.nombre)
		console.log('Correo: ' + estudiante.correo)
		console.log('Telefono: ' + estudiante.telefono)
		console.log('Tipo: ' + estudiante.tipo + '\n')
	})
}

const mostrarest = (varid) => {
	listar();

	return listaEstudiantes.find(buscar => buscar.id == varid.id);

}

const actualizar = (estudiante) => {
	listar();
	let est = listaEstudiantes.find(buscar => buscar.id == estudiante.id);
	if (!est){
		console.log('No existe este estudiante');
	}
	else
	{
		est.nombre = estudiante.nombre;
		est.correo = estudiante.correo;
		est.telefono = estudiante.telefono;
		guardar('actualizado');
	}
}

const eliminar = (varid) => {
	listar();
	let eliminarest = listaEstudiantes.filter(eliminar => eliminar.id != varid);
	if (varid.length == listaEstudiantes.length){
		console.log('No existe este estudiante');
	}
	else
	{
		let est = listaEstudiantes.find(buscar => buscar.id == varid);
		if (est)
		{
			listaEstudiantes = eliminarest;
			guardar('eliminado');
		}
		else
		{
			console.log('No existe este estudiante');
		}
	}
}
/*fabian*/
var eliminarData = (rutaFile, tipoData, buscar = false) => {
	consultarData(rutaFile, tipoData);

	if (tipoData == 'cursosAspirante') {
		let eliminarMisCursos = dataMisCursos.filter(eliminar => (eliminar.txt_id_curso != buscar.id_curso || eliminar.id_estudiante != buscar.id));
		let est = dataMisCursos.find(eliminar => (eliminar.txt_id_curso == buscar.id_curso && eliminar.id_estudiante == buscar.id));

		console.log(eliminarMisCursos);
		console.log(est);
		if (est)
		{

			dataMisCursos = eliminarMisCursos;
			clln_usuariosCursos.deleteOne(
				{id_estudiante: parseInt(buscar.id), txt_id_curso: buscar.id_curso}
				, (err, result) => {
					if(err)
					{
						console.log("Error al eliminar el curso de usuario. Error: " + err);
					}
					else
					{
						console.log("Asignacion eliminada correctamente");
					}
			});
		}

	}
	return guardarData(rutaFile, false, tipoData);
}

module.exports = {
	guardarData,
	consultarData,
	actualizarData,
	crear,
	mostrar,
	mostrarest,
	actualizar,
	eliminar,
  	eliminarData,
  	isEmpty
};