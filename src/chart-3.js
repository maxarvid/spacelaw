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

// function that determines if a point is in a polygon
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
  console.log(countries)

  // draw the countries
  svg
    .append('g')
    .selectAll('.country')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', d => {
      console.log(d.geometry)
      return '#F5ECCE'
    })
    .attr('stroke', 'black')
    .attr('stroke-width', 0.1)

  // add the guessing satellite
  svg
    .append('text')
    .classed('satellite-guess', true)
    .text('🛰')
    .attr('x', 100)
    .attr('y', 55 + height / 2)
    .attr('text-anchor', 'middle')

  svg
    .append('text')
    .classed('instructions', true)
    .text('Drag me to a country!')
    .attr('x', 30)
    .attr('y', height / 2)
  svg
    .append('text')
    .classed('instructions-arrow', true)
    .text('⬇️')
    .attr('x', 100)
    .attr('y', 30 + height / 2)
    .attr('text-anchor', 'middle')

  // add drag functionality to guessing satellite
  var drag = d3
    .drag()
    .on('start', function() {
      d3.select(this)
        .style('cursor', 'pointer')
        .style('font-size', '24px')
        .raise()
    })
    .on('drag', function() {
      let [mouseX, mouseY] = d3.mouse(this)
      d3.select(this)
        .style('cursor', 'none')
        .attr('x', mouseX)
        .attr('y', mouseY)
    })
    .on('end', function() {
      d3.select(this).style('font-size', '18px')
      // turning pixel coords to lat long
      let [mouseX, mouseY] = projection.invert(d3.mouse(this))

      var guess = 'hello'
      // iterating through each country
      countries.features.forEach(country => {
        // there are some weird nulls in the data
        if (country.geometry && country.geometry.type === 'Polygon') {
          country.geometry.coordinates.forEach(d => {
            if (classifyPoint(d, [mouseX, mouseY]) < 0) {
              // console.log('you guessed ', country.properties.name)
              guess = country.properties.name
            }
          })
        } else if (
          country.geometry &&
          country.geometry.type === 'MultiPolygon'
        ) {
          country.geometry.coordinates.forEach(d => {
            if (classifyPoint(d[0], [mouseX, mouseY]) < 0) {
              // console.log('You guessed', country.properties.name)
              guess = country.properties.name
            }
          })
        }
      })
      console.log('did this work?', guess)
      d3.select('#country-guess').text(guess)
      if (guess === 'Ukraine') {
        d3.select('#wrong-right').text('correct')
      } else {
        d3.select('#wrong-right').text('incorrect')
      }
      d3.select('#answer').style('display', 'block')
    })
  svg.select('.satellite-guess').call(drag)
}
