import { csvToJson, csvToKeyValue } from '../lib/csvToJson'
import findUser from '../lib/findUser'
import riskSummaryChart from '../lib/riskSummaryChart'
import continentSummary from '../lib/continentSummary'
import riskListSummary from '../lib/riskList'
import cities_csv from '../data/pollution_geolocated.csv'
import { share } from '../lib/share.js'
import continent from '../data/countryToContinent.json'

let summaryChart;

var shareFn = share('Are you at risk? Find out how pollution levels increase your chance of death','https://gu.com/p/5q5px')

function init(){

	console.log('ready')

	//list of cities parsed from csv
	let cities = csvToJson(cities_csv, "\t");
	//let continent = csvToKeyValue(continent_csv, ",");

	cities.forEach(c => {
		if(c.country in continent){
			c.continent = continent[c.country];
		} else {
			//console.log('not found', c.city, c.country, c.continent)
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

	let riskList = riskListSummary();
	userControls.registerListener(riskList.setUserData);


	//initialize risk small multiples
	// let riskMultiples = riskByTypeCharts(cities);
	// riskMultiples.init();
	// userControls.registerListener(riskMultiples.setUserData);


	// Share buttons
	[].slice.apply(document.querySelectorAll('.gv-share-container button')).forEach(shareEl => {
	    var network = shareEl.className.replace('share-','');
	    shareEl.addEventListener('click',() => shareFn(network));
	});


}

init();
