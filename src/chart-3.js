import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
}

let width = 700 - margin.left - margin.right
let height = 400 - margin.top - margin.bottom

let svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

// We need this rectangle to collect clicks
svg
  .append('rect')
  .attr('width', width)
  .attr('height', height)
  .attr('opacity', 0)

let projection = d3.geoNaturalEarth1()
let path = d3.geoPath().projection(projection)

// This is a function that determines if a point is in a polygon
var classifyPoint = require('robust-point-in-polygon')

Promise.all([
  d3.csv(require('./data/national_law_count.csv')),
  d3.json(require('./data/world.topojson'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([datapoints, json]) {
  let countries = topojson.feature(json, json.objects.countries)
  projection.fitSize([width, height], countries)
  // console.log(countries)

  // draw the countries
  svg
    .append('g')
    .selectAll('.country')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', '#F5ECCE')
    .attr('stroke', 'black')
    .attr('stroke-width', 0.1)

  // add the guessing satellite
  svg
    .append('text')
    .classed('satellite-guess', true)
    .text('🛰')
    .attr('x', 20)
    .attr('y', 20)
    .attr('text-anchor', 'middle')

  // add drag functionality to guessing satellite
  var drag = d3
    .drag()
    .on('start', function() {
      console.log('start drag')
      d3.select(this)
        .style('cursor', 'pointer')
        .style('font-size', '24px')
        .raise()
    })
    .on('drag', function() {
      console.log('dragging!')
      let [mouseX, mouseY] = d3.mouse(this)
      console.log(mouseX, mouseY)
      d3.select(this)
        .style('cursor', 'none')
        .attr('x', mouseX)
        .attr('y', mouseY)
    })
    .on('end', function() {
      console.log('end drag')
      d3.select(this).style('font-size', '18px')
      // turning pixel coords to lat long
      let [mouseX, mouseY] = projection.invert(d3.mouse(this))
      // console.log('guess coords are ', mouseX, mouseY)
      countries.features.forEach(d => {
        // there are some weird nulls in the data
        if (d.geometry && d.geometry.type === 'Polygon') {
          console.log(d.properties.name)
          // console.log(d.geometry)
          d.geometry.coordinates.forEach(d => {
            // console.log('coords are ', d)
            console.log('in polygon? ', classifyPoint(d, [mouseX, mouseY]))
          })
        } else if (d.geometry && d.geometry.type === 'MultiPolygon') {
          console.log('HELLO', d.properties.name)
          console.log(d.geometry.coordinates)
          d.geometry.coordinates.forEach(d => {
            console.log(d)
            //console.log('in multipolygon', classifyPoint(d, [mouseX, mouseY]))
          })
        }
      })
    })
  svg.select('.satellite-guess').call(drag)
}
