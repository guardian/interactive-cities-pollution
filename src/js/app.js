import csvToJson from '../lib/csvToJson'
import findUser from '../lib/findUser'
import riskSummaryChart from '../lib/riskSummaryChart'
import riskByTypeCharts from '../lib/riskByTypeCharts'
import cities_csv from '../data/pollution_geolocated.csv'


let summaryChart;

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


}

init();
