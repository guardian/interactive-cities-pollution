import riskCurveData from '../data/riskCurveData.json'
import debounce from '../lib/debounce'

import {
	line as d3_line
	//curveBasis as d3_curveBasis
} from 'd3-shape';

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
    scaleLinear
} from 'd3-scale';

import {
	axisLeft as d3_axisLeft,
	axisRight as d3_axisRight,
	axisBottom as d3_axisBottom
} from 'd3-axis';


export default function() {

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

    let xscale=scaleLinear(),
		yscale=scaleLinear();

	let container=d3_select('.riskSummaryChart')

	let svgshell, svg, lines;

    let extents = {
	    	pm25: d3_extent(riskCurveData,d=>d.PM25),
	    	dataRange: d3_extent(riskCurveData,d=>d.r)
	    }

	let lineTypes = ['r', 'p', 'h', 'l', 's'];

    


    function buildVisual(){
		console.log("BUILDING VISUAL")
   	
    	svgshell = container.append("svg")
    	
    	svg = svgshell.append('g')
    				.attr("transform", `translate(${margins.left}, ${margins.top})`)
			

    	xscale.domain(extents.pm25);
		yscale.domain(extents.dataRange);

		// Add the X Axis
		svg.append("g")
			.attr('class', 'riskXaxis')

			// Add the Y Axis
		svg.append("g")
			.attr('class', 'riskYaxis')

			

		let dots = svg.append("g")
						.attr("class", "riskCircles");
    	

    	lineTypes.forEach(function(l){
    		let typeGroup = svg.append("g")
    		
    		typeGroup.append('path')
    			.attr("class", d => `riskLine riskLineBase ${l}`)
    			.attr("id", l)

    		typeGroup.append('path')
    			.attr("class", d => `riskLine riskLineUser ${l}`)
    			.attr("id", l)

    		dots.append("circle")
    			.attr("class", d => `riskCircle riskCircle-${l}`)
    			.attr("id", l)
    			.attr('r', 5)

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
		
		xscale.range([0,params.WIDTH - ( margins.left + padding.left + margins.right  + padding.right)]);
		yscale.range([params.HEIGHT - (margins.bottom + padding.bottom + margins.top+padding.top),0]);

		svgshell.attr("width",params.WIDTH).attr("height",params.HEIGHT);

		//console.log('drawing visual', params, margins, 0-(params.HEIGHT-margins.top-margins.bottom))
  
		//setCurves
		d3_selectAll('.riskLine')
			.attr('d', function(data){
				let type = d3_select(this).attr('id');
		
				let valueline = d3_line()
					//.curve(d3_curveBasis)
				    .x(function(d) { return xscale(d.PM25); })
				    .y(function(d) { return yscale(d[type]); })


				return valueline(riskCurveData);
			})


		// Add the X Axis
		d3_select(".riskXaxis")
				.attr("transform", "translate(0," + (params.HEIGHT - margins.bottom  - margins.top) + ")")
				.call(d3_axisBottom(xscale));

		// Add the Y Axis
		d3_select(".riskYaxis")
    			.call(d3_axisRight(yscale));


    	d3_selectAll("g.riskYaxis g.tick line")
    		.attr("x1", 0-margins.left)
    		.attr("x2", params.WIDTH-margins.left)
    		.attr("stroke-dasharray", "1, 3");	

    	d3_selectAll("g.riskYaxis g.tick text")
    		.attr("y", -12)
    		.attr("x", 0-margins.left);	

    	d3_selectAll("g.riskYaxis g.tick line")
		    .filter(function (d) { return d === 0;  })
		    .attr("class", "firstTick");				

		d3_select("g.riskXaxis domain path")
		    .attr("display", "none");

    	d3_selectAll('.riskCircle')
    			.attr('transform', `translate(${xscale(0)},${yscale(0)})`);


    	customYAxis	();		

	}

	function moveDots(userData){

		let userPM = userData.PM25;

		let userCurveData = riskCurveData.filter(function(d){
			return (d.PM25 <= userPM) ? true : false;
		})

		let currentPoint = riskCurveData.filter(function(d){
			return (d.PM25 === userPM) ? true : false;
		})[0];

		d3_selectAll('.riskLineUser')
			.attr('d', function(data){
				let type = d3_select(this).attr('id');
		
				let valueline = d3_line()
					//.curve(d3_curveBasis)
				    .x(function(d) { return xscale(d.PM25); })
				    .y(function(d) { return yscale(d[type]); });

				return valueline(userCurveData);
			})

		d3_selectAll('.riskLineBase').classed('dataVisible', true)


		var maxLength = 1000;
		var maxTime = 1000;



		d3_selectAll('.riskCircle')
			.classed('riskCirclesActive', true)
			.attr('transform', function(d){
				let type = this.getAttribute('id');
			 	let path = d3_select(`.riskLineUser.${type}`).node();
			 	let x = xscale(currentPoint.PM25);
			 	let y = yscale(currentPoint[type]);
			 	return `translate(${x},${y})`
			})


	}


	function customXAxis(g) {
	  g.call(xaxis);
	  g.select(".domain").remove();
	}

	function customYAxis() {
	  d3_select(".riskYaxis")
	  .select(".domain")
	  .remove().selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2")
	  .selectAll(".tick text").attr("x", 4).attr("dy", -12);
	}

	// Returns an attrTween for translating along the specified path element.
	function translateAlong(path) {
		console.log('HERE HERE', path)
		

	  var l = path.getTotalLength();
	  return function(d, i, a) {
	    return function(t) {
	      var p = path.getPointAtLength(t * l);
	      return "translate(" + p.x + "," + p.y + ")";
	    };
	  };
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
		setUserData: moveDots

	}



}

