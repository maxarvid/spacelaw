import * as d3 from 'd3'

let margin = { top: 50, left: 80, right: 50, bottom: 50 }

let height = 600 - margin.top - margin.bottom
let width = 600 - margin.left - margin.right

let svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

let xPositionScale = d3.scaleLinear().range([0, width])

let yPositionScale = d3
  .scaleBand()
  .range([0, height])
  .padding(0.1)

d3.csv(require('./data/national_law_count.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // console.log('data is', datapoints)

  let lawList = datapoints.map(d => +d.count)
  xPositionScale.domain([0, d3.max(lawList)])

  let countryList = datapoints.map(d => d.country)
  yPositionScale.domain(countryList)

  // draw the bar chart
  svg
    .selectAll('.bars')
    .data(datapoints)
    .enter()
    .append('rect')
    .classed('bars', true)
    .attr('x', 0)
    .attr('y', d => yPositionScale(d.country))
    .attr('width', d => xPositionScale(d.count))
    .attr('height', yPositionScale.bandwidth())
    .attr('fill', 'lightgrey')

  // add title
  svg
    .append('text')
    .text('number of national space laws on the books')
    .attr('x', width / 2)
    .attr('y', 0)
    .attr('alignment-baseline', 'ideographic')
    .attr('text-anchor', 'middle')
    .attr('font-size', '20')

  // axes
  const xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
