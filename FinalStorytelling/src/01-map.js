import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 0, right: 0, bottom: 0 }

let height = 500 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let projection = d3.geoMercator()
// define which projection you want to use
// then feed it into the geoPath
let graticule = d3.geoGraticule()
// graticules make a bunch of lines that go accross the map
// console.log(graticule())
let path = d3.geoPath().projection(projection)
// you're gonna make geographical shapes so geoPath
// you have to specifiy a projection using .projection.

let colorScale = d3
  .scaleOrdinal()
  .domain(['S', 'R', 'NA'])
  .range(['blue', 'red', 'yellow'])

Promise.all([
  d3.json(require('./data/world.topojson')),
  d3.csv(require('./data/spaceTreatiesCleaned.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([json, datapoints]) {
  let countries = topojson.feature(json, json.objects.countries)

  let treatyCountries = datapoints.map(d => d.Countries)
  let moonCountries = datapoints.map(d => {
    if (d.MOON === 'R' || d.MOON === 'S') {
      return d.Countries
    }
  })

  moonCountries = moonCountries.filter(Boolean)

  console.log(moonCountries)
  // console.log(countries.features.map(d => d.geometry))
  // console.log(treatyCountries)

  svg
    .selectAll('.country')
    .data(countries.features) // always going to be .features (list inside geojson)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', d => {
      // console.log(d.properties.name)
      var country = d.properties.name
      if (moonCountries.indexOf(country) >= 0) {
        return 'green'
      } else if (treatyCountries.indexOf(country) >= 0) {
        return 'blue'
      } else {
        return 'grey'
      }
      // console.log(datapoints.country)
    })

  // svg
  //    .selectAll('.country')
  //    .data(datapoints)
  //    .attr('fill', d => {
  //      console.log(d)
  //      return colorScale(d.ARRA)
  //    })
  svg // adding long lat lines to map
    .append('path')
    .datum(graticule())
    .attr('d', path)
    .attr('stroke', 'lightgrey')
    .lower()
}
