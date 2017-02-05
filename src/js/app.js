import { csvToJson, csvToKeyValue } from '../lib/csvToJson'
import findUser from '../lib/findUser'
import riskSummaryChart from '../lib/riskSummaryChart'
import continentSummary from '../lib/continentSummary'
import cities_csv from '../data/pollution_geolocated.csv'
import continent from '../data/countryToContinent.json'


let summaryChart;

function init(){

	console.log('ready')

	//list of cities parsed from csv
	let cities = csvToJson(cities_csv, "\t");
	//let continent = csvToKeyValue(continent_csv, ",");
	console.log(continent)
	cities.forEach(c => {
		if(c.country in continent){
			c.continent = continent[c.country];
		} else {
			console.log('not found', c.city, c.country, c.continent)
		}
	})

	//initializes find user class
	let userControls = findUser(cities);


	//initialize summary chart
	let summaryChart = riskSummaryChart();
	summaryChart.init();
	userControls.registerListener(summaryChart.setUserData);

	//initialize summary chart
	let continentChart = continentSummary(cities);
	continentChart.init();
	userControls.registerListener(continentChart.setUserData);

	//initialize risk small multiples
	// let riskMultiples = riskByTypeCharts(cities);
	// riskMultiples.init();
	// userControls.registerListener(riskMultiples.setUserData);


}

init();
