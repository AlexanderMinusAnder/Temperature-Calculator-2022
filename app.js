const geoCode = require("./utiles/geoCode");
const forecast = require("./utiles/forecast");
const express = require('express');
const bodyParser = require('body-parser');
const res = require("express/lib/response");

const axios = require("axios");


const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
	extended: true
  }))

app.use(express.static('public'));

app.use(express.json());

const port = 3001;
app.listen(port, ()=> {console.log(`Server listenning on port ${port}`)});

app.get("/", (req, res)=> {
	res.render("index");

})

app.post("/temperature", async (req, res)=> {

	const ville = req.body.city

	try {
		const geoloc = await geoCode(ville);
		const temp = await forecast(geoloc);
		console.log(temp)
		console.log(`La température à ${ville} est de ${temp}°C.`);

		const result = {
			ville,
			temp
		}

	res.render("temperature", result);

	} catch (err) {
		console.log(err.message);
	}

})

app.get("/about", async (req, res)=> {
	res.render("about");
})

app.post("/suggestion", async (req, res) => {
	const API_KEY = process.env.API_WEATHER_KEY;

	if(req.body.city != "") {
		const { data } = await axios(`https://api.openweathermap.org/geo/1.0/direct?q=${req.body.city}&limit=5&appid=${API_KEY}`);

		const suggestions = data
  		.filter(city => {
    		return city.country === "FR";
  		})
  		.map(city => {
    		return {
      			name: city.name,
				state: city.state
    		};
  		});

		const uniqueSuggestions = suggestions.filter((city, index) => {
			return suggestions.findIndex(c => c.state === city.state) === index;
		});

		res.send(uniqueSuggestions)
	} 
})
