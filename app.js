var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

connections = [];

server.listen(process.env.OPENSHIFT_NODEJS_PORT || 3000, process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
console.log('Server rodando...');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Conectado: %s sockets conectado(s)', connections.length);

	//OnDisconect
	socket.on('disconnect', function(data) {
		connections.splice(connections.indexOf(socket), 1);
		console.log('Um client desconectou...'+data);
		console.log('Conectado: %s sockets conectado(s)', connections.length);
	});
	
	//Enviando msg
	socket.on('msgEnviada', function(data) {
		console.log(data);
		io.sockets.emit('postMsg', {msg: data})
	});
});