import debounce from '../lib/debounce'
import toTitleCase from '../lib/toTitleCase'

import {
	line as d3_line
	//curveBasis as d3_curveBasis
} from 'd3-shape';

import { nest as d3_nest } from 'd3-collection';

import {
    select as d3_select,
    selectAll as d3_selectAll
} from 'd3-selection';

import { transition } from 'd3-transition';

import {
	max as d3_max,
	sum as d3_sum,
	quantile as d3_quantile,
	extent as d3_extent
} from 'd3-array'

import {
	scalePoint,
    scaleLinear
} from 'd3-scale';

import {
	axisLeft as d3_axisLeft,
	axisRight as d3_axisRight,
	axisBottom as d3_axisBottom
} from 'd3-axis';


export default function(cities) {

	let margins = {
        top: 12,
        bottom: 36,
        left: 5,
        right: 0
    };

    let padding = {
        top: 0,
        bottom: 0,
        left: 5,
        right: 0
    };

	let container=d3_select('.continentSummary')

	let svgshell, svg;

  let regionData = processData(cities);

	let extents = {
    pm25: [0, d3_max(cities,d=>d.PM25)]
  }

	let xscale=	scaleLinear()
							.domain(extents.pm25);

	let regions = ["namerica","samerica","europe","africa","middle_east","asia","oceania"];


  function buildVisual(){
		//console.log("BUILDING VISUAL")

    	svgshell = container.append("svg")

    	svg = svgshell.append('g')
    				.attr("transform", `translate(${margins.left}, ${margins.top})`)



			// Add the X Axis
			svg.append("g")
				.attr('class', 'regionXaxis');

			regions.forEach(r =>{

				var g = svg.append('g')
						.attr('class', `regiong regiong-${r}`);

						g.append('line')
							.attr('class', `spread spread-${r}`);

						g.append('rect')
							.attr('class', `quater3 quater3-${r}`);

						g.append('rect')
							.attr('class', `quater2 quater2-${r}`);

						g.append("circle")
						    			.attr("class", d => `userData userData-${r}`)
						    			.attr('r', 5)

						g.append('text')
											.attr("class", d => `userDataText userDataText-${r}`)

						g.append('text')
							.text( function(){
								if(r == 'namerica'){
									return 'North America'
								} else if(r == 'samerica'){
									return 'South America'
								} else if(r == 'europe'){
									return 'Europe'
								} else if(r == 'africa'){
									return 'Africa'
								} else if(r == 'middle_east'){
									return 'Middle East'
								} else if(r == 'asia'){
									return 'Asia'
								} else if(r == 'oceania'){
									return 'Oceania'
								}
							})
							.attr('class', `regionLabel regionLabel-${r}`)


			})




     	drawVisual();

     	window.addEventListener('resize', function(){
     		resizeChart()
     	});
	}

	var resizeChart = debounce(function() {
		drawVisual();
	}, 250);

	function drawVisual(){

		let params = measure();

		let offsetY = (params.HEIGHT - margins.bottom  - margins.top - padding.top - padding.bottom)/regions.length;

		svgshell.attr("width",params.WIDTH).attr("height",params.HEIGHT);
		xscale.range([0,params.WIDTH - ( margins.left + padding.left + margins.right  + padding.right)]);


		// Add the X Axis
		d3_select(".regionXaxis")
				.attr("transform", "translate(0," + (params.HEIGHT - margins.bottom  - margins.top) + ")")
				.call(d3_axisBottom(xscale));

				d3_selectAll('.regionXaxis .tick line')
					.attr('y2', -params.HEIGHT)



					let i = 0;
					regions.forEach(r =>{

						var rd = regionData.filter(a => {
							return a.key == r;
						})[0];
						//console.log(rd)

						d3_select(`.regiong-${r}`).attr("transform", "translate(0," + (offsetY * i) + ")")
						d3_select(`.regionLabel-${r}`).attr("transform", "translate("+ xscale( rd.sortedPM25[0] ) +"," + (offsetY/2 - 15) + ")")


						d3_select(`.spread-${r}`)
											.attr('x1', d => {
												return xscale( rd.sortedPM25[0] );
											})
											.attr('x2', d => {
												return xscale( rd.sortedPM25[ rd.sortedPM25.length -1 ] );
											})
											.attr('y1', offsetY/2)
											.attr('y2', offsetY/2);


						d3_select(`.quater2-${r}`)
								.attr('x', d => {
									return xscale( rd.quartiles[0] );
								})
								.attr('width', d => {
									let value = xscale( rd.quartiles[1] - rd.quartiles[0] );
									return (value == 0) ? 2 : value;
								})
								.attr('y',  offsetY/2 - 10)
								.attr('height',  20);



						d3_select(`.quater3-${r}`)
								.attr('x', d => {
									return xscale( rd.quartiles[1] );
								})
								.attr('width', d => {
									return xscale( rd.quartiles[2] - rd.quartiles[1] );
								})
								.attr('y',  offsetY/2 - 10)
								.attr('height',  20);


								d3_select(`.userData-${r}`)
									.attr('cy',  offsetY/2);

									d3_select(`.userDataText-${r}`)
										.attr('y',  offsetY/2+25);

						i ++;
					})



	}

	function setUserData(userData){

		d3_selectAll('.userData,.userDataText').classed('active', false);

		d3_select(`.userData-${userData.continent}`)
			.classed('active', true)
			.attr('cx', xscale(userData.PM25));


			d3_select(`.userDataText-${userData.continent}`)
				.classed('active', true)
				.text(`${toTitleCase(userData.city)}`)
				.attr('x', xscale(userData.PM25));

	}

  function processData(cities){

  	let continentNested = d3_nest()
  										.key(function(d) {
  												return d.continent;
  										})
  										//.rollup(function(group) { return group.length; })
  										.entries(cities);

    continentNested.forEach(d => {
			var data = [];
			d.values.forEach(c => {
				data.push(c.PM25);
			})

			data = data.sort(function(a, b) {
			  return a - b;
			});

			d.quartiles =  boxQuartiles(data) ;
			d.sortedPM25 = data;

    })

		function boxQuartiles(data) {
		  return [
		    d3_quantile(data, .25),
		    d3_quantile(data, .5),
		    d3_quantile(data, .75)
		  ];
		}




    return continentNested

  }



	function measure(){
		let box = container.node().getBoundingClientRect();
		let WIDTH = box.width;
    let HEIGHT = box.width * .5;//box.height;
		if(HEIGHT < 400){
			 HEIGHT = 400;
		}


		return {
			WIDTH: WIDTH,
			HEIGHT: HEIGHT
		}
	}

	return {
		init: buildVisual,
		setUserData: setUserData

	}



}
