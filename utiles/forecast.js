require("dotenv").config();

const axios = require("axios");

const API_KEY = process.env.API_WEATHER_KEY;


const forecast = async localisation => {
	let temp;
	try {
		const { data } = await axios(
			`https://api.openweathermap.org/data/2.5/weather?lat=${localisation.latitude}&lon=${localisation.longitude}&appid=${API_KEY}`
		);
		temp = (data.main.temp - 273.15).toFixed(2);
		return temp;
	} catch (err) {
		console.log(err.message);
		throw err;
	}
};

module.exports = forecast;
