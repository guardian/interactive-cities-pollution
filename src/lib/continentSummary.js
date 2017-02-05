import debounce from '../lib/debounce'

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
	extent as d3_extent
} from 'd3-array'

import {
	scalePoint,
    scaleLinear,
    scaleQuantile
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
        left: 20,
        right: 0
    };

    let padding = {
        top: 0,
        bottom: 0,
        left: 30,
        right: 0
    };

	let container=d3_select('.continentSummary')

	let svgshell, svg;

  let regionData = processData(cities);

  let extents = {
      pm25: d3_extent(cities,d=>d.PM25)
    }

  function buildVisual(){
		console.log("BUILDING VISUAL")

    	svgshell = container.append("svg")

    	svg = svgshell.append('g')
    				.attr("transform", `translate(${margins.left}, ${margins.top})`)





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

		svgshell.attr("width",params.WIDTH).attr("height",params.HEIGHT);




	}

	function setUserData(userData){



	}

  function processData(cities){
    console.log('summary:', cities)

  	let continentNested = d3_nest()
  										.key(function(d) {
  												return d.continent;
  										})
  										//.rollup(function(group) { return group.length; })
  										.entries(cities);

    continentNested.forEach(d => {


      // var scale = scaleQuantile()
      //     .domain(d.values)
      //     .range(['first', 'second', 'third', 'fourth']);
      //
      // d.quantiles = scale.quantiles();
      // console.log(d)
    })



    console.log( continentNested)

  }



	function measure(){
		let box = container.node().getBoundingClientRect();
		let WIDTH = box.width;
    	let HEIGHT = box.width * .5;//box.height;

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
