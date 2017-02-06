import csvToJson from '../lib/csvToJson'
import findUser from '../lib/findUser'
import riskSummaryChart from '../lib/riskSummaryChart'
import riskByTypeCharts from '../lib/riskByTypeCharts'
import cities_csv from '../data/pollution_geolocated.csv'
import { share } from '../lib/share.js'

let summaryChart;

var shareFn = share('Share text goes here','https://www.theguardian.com/p/5dtd9')

function init(){

	console.log('ready')

	//list of cities parsed from csv
	let cities = csvToJson(cities_csv);

	//initializes find user class
	let userControls = findUser(cities);


	//initialize summary chart
	let summaryChart = riskSummaryChart();
	summaryChart.init();
	userControls.registerListener(summaryChart.setUserData);



	//initialize risk small multiples
	let riskMultiples = riskByTypeCharts(cities);
	riskMultiples.init();
	userControls.registerListener(riskMultiples.setUserData);


	// Share buttons
	[].slice.apply(document.querySelectorAll('.gv-share-container button')).forEach(shareEl => {
	    var network = shareEl.className.replace('share-','');
	    shareEl.addEventListener('click',() => shareFn(network));
	});


}

init();
