import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 50, left: 50, right: 50, bottom: 50 }

let height = 600 - margin.top - margin.bottom
let width = 600 - margin.left - margin.right

let svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

let projection = d3.geoOrthographic()
let path = d3.geoPath().projection(projection)

let radius = 280

let radiusScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range([0, radius])

var angleScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range([0, Math.PI * 2])

d3.json(require('./data/world.topojson'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(json) {
  let countries = topojson.feature(json, json.objects.countries)
  projection.fitSize([width, height], countries)

  // add the planet
  svg
    .append('path')
    .datum({ type: 'Sphere' })
    .attr('d', path)
    .attr('class', 'sphere')
    .attr('fill', '#81DAF5')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)

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

  // adding a satellite
  svg
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)
    .append('text')
    .classed('satellite', true)
    .text('🛰')
    .attr('x', 0)
    .attr('y', -radiusScale(1))
    .attr('text-anchor', 'middle')

  // spinning the satelite
  d3.select('#chart-1-click').on('click', () => {
    d3.transition()
      .duration(5000)
      .ease(d3.easeElastic)
      .tween('spin', () => {
        return function(t) {
          d3.select('.satelite').attr('transform', () => {
            let degrees = (angleScale(t) / Math.PI) * 180
            return `rotate(${degrees})`
          })
        }
      })
  })
}
