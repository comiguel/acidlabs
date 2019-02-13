const express = require('express');
const engine = require('socket.io');
const redis = require('redis');
const rClient = redis.createClient();

rClient.on("error", function (err) {
	console.log("Error " + err);
});

const port = 3000;
const app = express();

app.use('/', express.static(__dirname + '/app'));

rClient.on("ready", function () {
	console.log(`Conectado a Redis`);
	let server = app.listen(port, () => {
	  console.log(`El servidor está escuchando en el puerto ${port}`);
	});

	const io = engine(server);

	io.on('connection', (socket) => {
		console.log('conectado cliente');
		socket.on('message', (msg) => {
			io.sockets.emit('message', msg);
		});
	});
});

rClient.get("name", function(err, reply) {
  console.log(reply);
});
