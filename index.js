const cities = require('./cities');
const config = require('./config');
const express = require('express');
const engine = require('socket.io');
const redis = require('async-redis');
const moment = require('moment-timezone');
const DarkSky = require('dark-sky');
const darksky = new DarkSky(config.forecast_key);
moment.locale('es');

const rClient = redis.createClient();

rClient.on("error", function (err) {
	console.log("Error " + err);
});

const port = config.port;
const app = express();
app.use('/', express.static(__dirname + '/dist'));

rClient.on("ready", async () => {
	console.log(`Conectado a Redis`);
	let server = await app.listen(port, async () => {
		console.log(`El servidor está escuchando en el puerto ${port}`);
		await rClient.set("cities", JSON.stringify(cities));
	});

	const io = engine(server);

	io.on('connection', async (socket) => {
		console.log('Conectado cliente');
		/*socket.on('requestUpdate', (forecast) => {
			const rCities = await getCities();
			io.sockets.emit('updatedForecast', forecast);
		});*/
			const rCities = await getCities();
			socket.emit('updatedForecast', rCities);
	});

	const ref = setInterval(async () => {
		let updated = false, intents = 0;
		while(!updated) {
			console.log(`Intento No. ${intents++}`);
			try {
				errorProbability();
				updated = true;
				const forecast = await updateForecast();
				rClient.set("cities", JSON.stringify(forecast));
				io.sockets.emit('updatedForecast', forecast);
			} catch (e) {
				console.log(`falló intento No. ${intents}`);
				errorHandler(e);
			}
		}
	}, 10000);
});

async function getCities() {
	return JSON.parse(await rClient.get('cities'));
}

async function updateForecast() {
	const now = moment(), forecast = {}, rCities = await getCities();
	for (city in rCities) {
		let result = await darksky
    .latitude(rCities[city].lat)
    .longitude(rCities[city].lon)
    .units('si')
    .language('es')
    .exclude('hourly,minutely,daily,flags')
    .get()
    .then()
    .catch(console.log);

    forecast[city] = {
    	lat: rCities[city].lat,
    	lon: rCities[city].lon,
    	date: now.tz(result.timezone).format('dddd, D [de] MMMM [de] YYYY'),
    	hour: now.tz(result.timezone).format('h:mm:ss a'),
    	icon: result.currently.icon,
    	summary: result.currently.summary,
    	temperature: `${result.currently.temperature} ºC`,
    }
	}
	return forecast;
}

function errorProbability() {
	if (Math.random() < 0.1) throw new Error('How unfortunate! The API Request Failed')
	return true;
}

async function errorHandler(e) {
	if (e.name === 'Error' && e.message === 'How unfortunate! The API Request Failed') {
		await logError(new Date().getTime(), e.message);
	}
}

async function logError(timestamp, message) {
	const reply = await rClient.get('api.errors');
	let errors = {};
	if (reply) {
		errors = JSON.parse(reply);
	}
	errors[timestamp] = message;
	await rClient.set("api.errors", JSON.stringify(errors));
}


