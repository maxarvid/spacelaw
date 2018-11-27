import * as d3 from 'd3'

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

let xPositionScale = d3.scaleLinear().range([0, width])

let yPositionScale = d3.scaleBand().range([height, 0])

d3.csv(require('./data/national_law_count.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  console.log('data is', datapoints)

  let lawList = datapoints.map(d => +d.count)
  xPositionScale.domain([0, d3.max(lawList)])

  let countryList = datapoints.map(d => d.country)
  yPositionScale.domain(countryList)

  // fix this later tonight.
  svg
    .selectAll('.bars')
    .data(datapoints)
    .enter()
    .append('rect')
    .classed('bars', true)
    .attr('x', 0)
    .attr('y', d => yPositionScale(d.country))
    .attr('width', 40)
    .attr('height', yPositionScale.scaleBand())
    .attr('fill', 'black')
}
