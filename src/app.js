var dataFiles = {
	'dataCursos': 'dataCursos.json',
	'dataCursosIns': 'dataCursosInscritos.json',
	'usuarios': 'listado.json'
};
var user = false;
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const fun = require('./funciones.js');
const multer  = require('multer');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 4000;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
require('./helpers.js');

const dirData = path.join(__dirname, '../data');
const dirPublico = path.join(__dirname, '/../public');
const dirNode_modules = path.join(__dirname , '../node_modules');
const dirPartials = path.join(__dirname , '../partials');
const dirViews = path.join(__dirname + '/../views');
hbs.registerPartials(dirPartials);

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
app.use(express.static(dirPublico));
app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.set('public', dirPublico);
app.set('views', dirViews);
app.set('view engine', 'hbs');

/*Cargar imagen*/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dirPublico + '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, 'avatar-'+ req.body.id + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })
/***********************************************************/

/******************Socket*********************************/
let contador = 0;
io.on('connection', client => {
	console.log("Un usuario se ha conectado");

	client.on("contador", () => {
		contador ++
		console.log(contador);
		client.emit("contador", contador);
	})

	client.emit("mensaje","Bienvenido");
  // client.on('event', data => { /* … */ });
  // client.on('disconnect', () => { /* … */ });
});
/***********************************************************/


/*fabian*/
app.get('/', (req, res) => {
	res.render('Login/login');
});

app.all('/login', (req, res) => {
	if (req.query.bool == 1)
	{
		let buscar = {
			id: req.body.idBuscar
		};
		user = fun.mostrarest(buscar);
		if(user)
		{
			if (user.tipo == 'Coordinador') {
				let usuarios = {
					id: '',
					nombre: '',
					correo: '',
					telefono: '',
					tipo: ''
				}
				res.render('Registro/index', usuarios);
			}else if(user.tipo == 'docente'){
				let rutaDataCursos = dirData+'\\'+dataFiles.dataCursos;
				let docente = user;
				res.render(
					'Docente/Listar/lstCursos',
					{
						rutaFile: rutaDataCursos,
						tipoData: 'cursosDocente',
						dataDocente: docente
					}
				);
			}else{
				let rutaData = dirData+'\\'+dataFiles.dataCursosIns;
				let estudiante = {
					id: user.id
				}
				res.render(
					'Aspirante/Listar/lstMisCursos',
					{
						rutaFile: rutaData,
						tipoData: 'misCursosAspirante',
						dataEstudiante: estudiante
					}
				);

			}
		}
		else
		{
			res.render('Login/login');
		}
	}else{
		res.render('Login/login');
	}
});
// [{"id":0,"nombre":"Coordinador","correo":"Coordinador@a.com","telefono":22594681,"tipo":"Coordinador"},{"id":1,"nombre":"fabian","correo":"a@a.com","telefono":23785696681,"tipo":"aspirante"},{"id":4,"nombre":"milenalinda","correo":"eliaselpro@a.com","telefono":7866786,"tipo":"aspirante"},{"id":103616161,"nombre":"JhonLindi","correo":"c@a.com","telefono":301222222,"tipo":"aspirante"},{"id":103611,"nombre":"JhonLindi2","correo":"c@a.com","telefono":301222222,"tipo":"aspirante"},{"id":324,"nombre":"324","correo":"c@a.com","telefono":324,"tipo":"aspirante"},{"id":123,"nombre":"123","correo":"c@a.com","telefono":312,"tipo":"aspirante"},{"id":321,"nombre":"sda","correo":"c@a.com","telefono":132,"tipo":"aspirante"},{"id":1036625627,"nombre":"holi","correo":"holi","telefono":654879,"tipo":"aspirante"},{"id":12156719792,"nombre":"jhon","correo":"jhon@jhgk.bom","telefono":654,"tipo":"aspirante"},{"id":12345,"nombre":"asd","correo":"asd@dsa.cs","telefono":12343242,"tipo":"aspirante"},{"id":123456789,"nombre":"qwertyuiop","correo":"ads@dsa.asd123","telefono":123123,"tipo":"aspirante"},{"id":987654,"nombre":"Docente","correo":"Docente@das.s","telefono":342423324,"tipo":"docente"}]
app.all('/registrarUsuario', upload.single('avatar'), (req, res) => {
	if(user)
	{
		if (user.tipo == 'Coordinador') {
			let usuarios = {
				id: '',
				nombre: '',
				correo: '',
				telefono: '',
				tipo: ''
			}
			let accion = '';
			if (req.query.acc) {
				if (req.query.acc == 'actualizar') {
					accion = req.query.acc;

				}

				if (accion != '') {
					usuarios = {
						id: req.query.id,
						nombre: req.query.nombre,
						correo: req.query.correo,
						telefono: req.query.telefono,
						tipo: req.query.tipo
					};
					if (req.query.save == 1) {
						let rutaData = dirData+'\\'+dataFiles.usuarios;
						usuarios = {
							id: req.body.id,
							nombre: req.body.nombre,
							correo: req.body.correo,
							telefono: req.body.telefono,
							tipo: req.body.tipo
						};

						if(accion == 'actualizar'){
							var save = fun.actualizarData(rutaData, 'datosUsuarios', usuarios);
						}
					}
				}
			}

			if (req.query.acc == 'crear' && req.query.save == 1) {
				let data ={
					id: parseInt(req.body.id),
					nombre: req.body.nombre,
					correo: req.body.correo,
					telefono: parseInt(req.body.telefono),
					tipo: req.body.tipo
				};
				fun.crear(data);
			}
			res.render('Registro/index',usuarios);
		}else if(user.tipo == 'docente'){
			let rutaDataCursos = dirData+'\\'+dataFiles.dataCursos;
			let docente = user;
			res.render(
				'Docente/Listar/lstCursos',
				{
					rutaFile: rutaDataCursos,
					tipoData: 'cursosDocente',
					dataDocente: docente
				}
			);
		}else{
			let rutaData = dirData+'\\'+dataFiles.dataCursosIns;
			let estudiante = {
				id: user.id
			}
			res.render(
				'Aspirante/Listar/lstMisCursos',
				{
					rutaFile: rutaData,
					tipoData: 'misCursosAspirante',
					dataEstudiante: estudiante
				}
			);
		}
	}
	else
	{
		res.render('Login/login');
	}
});
/*fabian*/

app.all('/Coordinador/frmCursos', (request, response) =>{
	if(user)
	{
		if (user.tipo != 'Coordinador') {
			response.render('Login/login');
		}
		else
		{
			let flagFRM = false;
			let accion = '';

			if (request.query.acc) {
				if (request.query.acc == 'crear' || request.query.acc == 'actualizar') {
					flagFRM = true;
					accion = request.query.acc;

				}

				if (accion != '') {
					let rutaDataUsers = dirData+'\\'+dataFiles.usuarios;

					let curso =	{
						accURL: accion,
						txt_id_curso: '',
						txt_nombre_curso: '',
						lst_modalidad: '',
						txt_intensidad: '',
						txt_valor: '',
						txa_descripcion: '',
						lst_estado: '',
						lst_docente: '',
						msj: '',
						rutaDataUsers: rutaDataUsers
					}

					if (request.query.acc == 'actualizar') {
						if (request.query.txt_id_curso && request.query.txt_nombre_curso && request.query.lst_modalidad && request.query.txt_intensidad && request.query.txt_valor && request.query.txa_descripcion && request.query.lst_estado) {
							curso =	{
								accURL: accion,
								txt_id_curso: request.query.txt_id_curso,
								txt_nombre_curso: request.query.txt_nombre_curso,
								lst_modalidad: request.query.lst_modalidad,
								txt_intensidad: request.query.txt_intensidad,
								txt_valor: request.query.txt_valor,
								txa_descripcion: request.query.txa_descripcion,
								lst_estado: request.query.lst_estado,
								lst_docente: request.query.lst_docente,
								msj: '',
								rutaDataUsers: rutaDataUsers
							}
						}
					}

					if (request.query.save == 1) {
						let rutaData = dirData+'\\'+dataFiles.dataCursos;
						let data = {
							txt_id_curso: request.body.txt_id_curso,
							txt_nombre_curso: request.body.txt_nombre_curso,
							lst_modalidad: request.body.lst_modalidad,
							txt_intensidad: request.body.txt_intensidad,
							txt_valor: request.body.txt_valor,
							txa_descripcion: request.body.txa_descripcion,
							lst_docente: request.body.lst_docente,
							lst_estado: request.body.lst_estado
						};

						if (accion == 'crear') {
							existe = fun.consultarData(rutaData, 'cursosCoordinador', data);

							if (existe) {
								var save = false
							}else{
								var save = fun.guardarData(rutaData, data, 'cursosCoordinador');

							}
						}else if(accion == 'actualizar'){
							var save = fun.actualizarData(rutaData, 'cursosCoordinador', data);
						}

						if (save) {
							response.redirect('/Coordinador/lstCursos');
						}else{
							data = {
								txt_id_curso: request.body.txt_id_curso,
								txt_nombre_curso: request.body.txt_nombre_curso,
								lst_modalidad: request.body.lst_modalidad,
								txt_intensidad: request.body.txt_intensidad,
								txt_valor: request.body.txt_valor,
								txa_descripcion: request.body.txa_descripcion,
								lst_docente: request.body.lst_docente,
								lst_estado: request.body.lst_estado,
								rutaDataUsers:rutaDataUsers
							};
							data.accURL = accion;
							data.msj = 'El id '+data.txt_id_curso+' ya existe.';
							response.render(
								'Coordinador/CrearActualizar/frmCursos',
								data
							);

						}

					}else{
						response.render(
							'Coordinador/CrearActualizar/frmCursos',
							curso
						);
					}
				}
			}

			if (!flagFRM) {
				response.redirect('/Coordinador/lstCursos');
			}
		}

	}
	else
	{
		response.render('Login/login');
	}
});

app.get('/Coordinador/lstCursos', (request, response) => {
	if(user)
	{
		if (user.tipo != 'Coordinador') {
			response.render('Login/login');
		}
		else
		{
			let rutaData = dirData+'\\'+dataFiles.dataCursos;
			response.render(
				'Coordinador/Listar/lstCursos',
				{
					rutaFile: rutaData,
					tipoData: 'cursosCoordinador'
				}
			);
		}

	}
	else
	{
		response.render('Login/login');
	}
});


app.get('/Docente/lstCursos', (request, response) => {
	let rutaData = dirData+'\\'+dataFiles.dataCursos;
	if(user)
	{
		if (user.tipo != 'docente') {
			response.render('Login/login');
		}
		else
		{
			let docente = user;
			response.render(
				'Docente/Listar/lstCursos',
				{
					rutaFile: rutaData,
					tipoData: 'cursosDocente',
					dataDocente: docente
				}
			);
		}
	}
	else
	{
		response.render('Login/login');
	}
});

app.get('/Aspirante/lstCursos', (request, response) => {
	let rutaData = dirData+'\\'+dataFiles.dataCursos;

	if(user)
	{
		response.render(
			'Aspirante/Listar/lstCursos',
			{
				rutaFile: rutaData,
				tipoData: 'cursosAspirante'
			}
		);
	}else{
		response.render(
			'Aspirante/Listar/lstCursos',
			{
				rutaFile: rutaData,
				tipoData: 'cursosNoAspirante'
			}
		);
	}
});

app.get('/Aspirante/lstMisCursos', (request, response) => {
	let rutaData = dirData+'\\'+dataFiles.dataCursosIns;

	if(user)
	{
		let estudiante = {
			id: user.id
		}

		if (request.query.acc) {
			if (request.query.acc == 'eliminar') {
				accion = request.query.acc;

			}

			if (accion != '') {
				estudiante.id_curso = request.query.txt_id_curso;
				var eliminar = fun.eliminarData(rutaData, 'cursosAspirante', estudiante);

				if (eliminar) {
					response.redirect('/Aspirante/lstMisCursos');
				}
			}
		}

		response.render(
			'Aspirante/Listar/lstMisCursos',
			{
				rutaFile: rutaData,
				tipoData: 'misCursosAspirante',
				dataEstudiante: estudiante
			}
		);
	}
	else
	{
		response.render('Login/login');
	}
});

app.get('/Coordinador/lstCursosInscritos', (request, response) => {
	let accion = '';
	let rutaData = dirData+'\\'+dataFiles.dataCursosIns;
	if(user)
	{
		if (user.tipo != 'Coordinador') {
			response.render('Login/login');
		}
		else
		{

			let curso = {
				id_curso: 0
			}
			if (request.query.acc) {
				if (request.query.acc == 'ver' || request.query.acc == 'eliminar') {
					accion = request.query.acc;

				}

				if (accion != '') {
					curso.id_curso = request.query.idCurso;
					if (accion == 'eliminar') {
						curso.id = request.query.id_estudiante;
						var eliminar = fun.eliminarData(rutaData, 'cursosAspirante', curso);

						if (eliminar) {
							response.redirect('/Coordinador/lstCursosInscritos?acc=ver&idCurso='+curso.id_curso);
						}
					}

				}
			}

			response.render(
				'Coordinador/Listar/lstCursosinscrito',
				{
					rutaFile: rutaData,
					tipoData: 'CursosInscritosCoordinador',
					curso: curso
				}
			);
		}
	}
	else
	{
		response.render('Login/login');
	}
});

app.get('/Docente/lstCursosInscritos', (request, response) => {
	let accion = '';
	let rutaData = dirData+'\\'+dataFiles.dataCursosIns;
	if(user)
	{
		if (user.tipo != 'docente') {
			response.render('Login/login');
		}
		else
		{

			let curso = {
				id_curso: 0
			}
			if (request.query.acc) {
				if (request.query.acc == 'ver') {
					accion = request.query.acc;

				}

				if (accion != '') {
					curso.id_curso = request.query.idCurso;

				}
			}

			response.render(
				'Docente/Listar/lstCursosinscrito',
				{
					rutaFile: rutaData,
					tipoData: 'CursosInscritosDocente',
					curso: curso
				}
			);
		}
	}
	else
	{
		response.render('Login/login');
	}
});


app.all('/Aspirante/frmCursos', (request, response) =>{
	let accion = '';
	if(user)
	{
		if (request.query.acc) {
			if (request.query.acc == 'ver' || request.query.acc == 'inscribir') {
				flagFRM = true;
				accion = request.query.acc;

			}

			if (accion != '') {

				if (request.query.txt_id_curso && request.query.txt_nombre_curso && request.query.lst_modalidad && request.query.txt_intensidad && request.query.txt_valor && request.query.txa_descripcion && request.query.lst_estado) {
					curso =	{
						accURL: accion,
						txt_id_curso: request.query.txt_id_curso,
						txt_nombre_curso: request.query.txt_nombre_curso,
						lst_modalidad: request.query.lst_modalidad,
						txt_intensidad: request.query.txt_intensidad,
						txt_valor: request.query.txt_valor,
						txa_descripcion: request.query.txa_descripcion,
						lst_estado: request.query.lst_estado
					}
				}

				if (request.query.save == 1) {
					let rutaData = dirData+'\\'+dataFiles.dataCursosIns;
					let data = {
						txt_id_curso: request.body.txt_id_curso,
						txt_nombre_curso: request.body.txt_nombre_curso,
						lst_modalidad: request.body.lst_modalidad,
						txt_intensidad: request.body.txt_intensidad,
						txt_valor: request.body.txt_valor,
						txa_descripcion: request.body.txa_descripcion,
						lst_estado: request.body.lst_estado,
						id_estudiante: user.id
					};
					if (accion == 'inscribir') {
						existe = fun.consultarData(rutaData, 'cursosAspirante', data);

						if (existe) {
							var save = false;
						}else{
							var save = fun.guardarData(rutaData, data, 'cursosAspirante');

						}
					}

					if (save) {
						msg = {
							to: user.correo,
							from: 'jhonfvs852@gmail.com',
							subject: 'Registro',
							text: 'Sr.'+user.nombre+' te has inscrito al curso '+data.txt_nombre_curso+' correctamente con una intensidad horaria de '+data.txt_intensidad+' en la plataforma de cursos del proyecto de node.js',
							html: '<strong>Sr.'+user.nombre+' te has inscrito al curso '+data.txt_nombre_curso+' correctamente con una intensidad horaria de '+data.txt_intensidad+' en la plataforma de cursos del proyecto de node.js</strong>',
						};
						console.log(sgMail.send(msg));
						response.redirect('/Aspirante/lstMisCursos');
					}else{
						data.accURL = accion;
						data.msj = 'El estudiante ya esta inscrito en este curso.';
						response.render(
							'Aspirante/CrearActualizar/frmCursos',
							data
						);

					}

				}else{
					response.render(
						'Aspirante/CrearActualizar/frmCursos',
						curso
					);
				}
			}
		}
	}
	else
	{
		response.render('Login/login');
	}

});

app.get('/chatBot', (request, response) => {
	response.render(
		'ChatBot/chatBot'
	);

});

server.listen(PORT, (err)=> {
	console.log(`Listening port: ${PORT}`);
});