import riskCurveData from '../data/riskCurveData.json'
import debounce from '../lib/debounce'

import {
	line as d3_line,
  curveStepAfter
	//curveBasis as d3_curveBasis
} from 'd3-shape';

import {
    select as d3_select,
    selectAll as d3_selectAll
} from 'd3-selection';

import { nest as d3_nest } from 'd3-collection';

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
	axisBottom as d3_axisBottom
} from 'd3-axis';



let margins, padding, xscale, yscale, shell, extents, lineTypes, container, nestedData;
let charts = [];

export default function(cities) {

	margins = {
        top: 0,
        bottom: 30,
        left: 40,
        right: 0
        };

  padding = {
        top: 0,
        bottom: 20,
        left: 30,
        right: 0
        };

  xscale=scaleLinear(),
	yscale=scaleLinear();

  lineTypes = ['r', 'p', 'h', 'l', 's'];

  nestedData = processData(cities, riskCurveData, lineTypes);
//  console.log('nesteddata', nestedData)
  extents = {
      x: [0, d3_max(nestedData, function(type){
        return (type.data.length -1) * 10 + 10
      })],
      y: [0, d3_max(nestedData, function(type){
        return d3_max(type.data, function(d){
          return d.value;
        });
      })],
  }

//  console.log('extents', extents)

  xscale.domain(extents.x);
  yscale.domain(extents.y);

	container=d3_select('.riskSummaryChart')


  function init(){

    lineTypes.forEach(function(type){
      var chart = stepChart(type);
      chart.drawVisual();
      charts.push( chart );
    })

  }

  return {
    init: init
  }

}



function stepChart(type){

  let chart = buildVisual(type);

  return chart;
}

function buildVisual(type){
  console.log("BUILDING VISUAL")

  let curveData = nestedData.find(function(d){
      return (d.type == type) ? d.type : false;
  })['data'];


  let container = d3_select(`.typeSvgChart.${type}`).append('svg');
  let svg = container.append('g')
              .attr("transform", `translate(${margins.left}, ${margins.top})`)

  // Add the X Axis
  let xAxis = svg.append("g")
              .attr('class', 'riskXaxis')

  // Add the Y Axis
  let yAxis = svg.append("g")
            .attr('class', 'riskYaxis')

  let typeGroup = svg.append("g")

  let line = typeGroup.append('path')
    .attr("class", d => `riskLineByType ${type}`)
    .attr("id", type)


  function drawVisual(){

    var params = measure();
    container.attr("width",params.WIDTH).attr("height",params.HEIGHT);

    console.log(svg,params.WIDTH, params.HEIGHT)

    xscale.range([0,params.WIDTH - ( margins.left + padding.left + margins.right  + padding.right)]);
		yscale.range([params.HEIGHT - (margins.bottom + padding.bottom + margins.top+padding.top),0]);



      // Add the X Axis
      xAxis.call(d3_axisBottom(xscale))
            .attr("transform", "translate(0," + (params.HEIGHT - margins.bottom - padding.bottom) + ")");


      // Add the Y Axis
      yAxis.call(d3_axisLeft(yscale));


      line
        .attr('d', function(data){

                let valueline = d3_line()
                  .curve(curveStepAfter)
                    .x(function(d) { return xscale(Number(d.key)); })
                    .y(function(d) { return yscale(d.value); });

                return valueline(curveData);
        });




  }

  function measure(){
    let box = container.node().getBoundingClientRect();
    let WIDTH = box.width;
      let HEIGHT = box.width;//box.height;


    return {
      WIDTH: WIDTH,
      HEIGHT: HEIGHT
    }
  }

  return {
    container: container,
    svg: svg,
    type: type,
    drawVisual: drawVisual
  };
}


function processData(cities, data, types){

  //do city conversion for each type
  types.forEach(function(type){
    cities.forEach(function(c){
      let cityData = riskCurveData[c.PM25];
      c[type] = riskCurveData[c.PM25][type];
    })
  });

  console.log('MERGED DATA', cities)

  let nestedData = [];

  types.forEach(function(type){

    let breakPoint = 10;
    let nested = d3_nest()
                      .key(function(d) {
                          let remainder = d[type] % breakPoint;
                          let val = (d[type] - remainder);
                          return val;
                      })
                      .rollup(function(group) { return group.length; })
                      .entries(cities);
                      console.log(type, nested)
    nestedData.push({
      type: type,
      data: nested.reverse()
    })

    //nestedData[type] = nested;

  })

  return nestedData;
}
