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

// making variables for everything
  let treatyCountries = datapoints.map(d => d.Countries)
  let moonCountries = datapoints.map(d => {
    if (d.MOON === 'R' || d.MOON === 'S') {
      return d.Countries
    }
  })

// in all cases S is for Signature R is for Ratified NA is for didn't sign / not a party

// MOON TREATY
  let moonCountriesR = datapoints.map(d => {
    if (d.MOON === 'R') {
      return d.Countries
    }
  })

  let moonCountriesS = datapoints.map(d => {
    if (d.MOON === 'S') {
      return d.Countries
    }
  })


  moonCountries = moonCountries.filter(Boolean)

// OUTERSPACE TREATY 
  let outerSpaceR = datapoints.map(d => {
    if (d.OST === 'R') {
      return d.Countries
    }
  })

  let outerSpaceS = datapoints.map(d => {
    if (d.OST === 'S') {
      return d.Countries
    }
  })

// Rescue Agreement 

  let rescueAgreementR = datapoints.map(d => {
    if (d.ARRA === 'R') {
      return d.Countries
    }
  })

  let rescueAgreementS = datapoints.map(d => {
    if (d.ARRA === 'S') {
      return d.Countries
    }
  })

// Liability Convention

  let liabilityConventionR = datapoints.map(d => {
    if (d.LIAB === 'R') {
      return d.Countries
    }
  })

  let liabilityConventionS = datapoints.map(d => {
    if (d.LIAB === 'S') {
      return d.Countries
    }
  })


// Registration Convention



  let registrationConventionR = datapoints.map(d => {
    if (d.REG === 'R') {
      return d.Countries
    }
  })

  let registrationConventionS = datapoints.map(d => {
    if (d.REG === 'S') {
      return d.Countries
    }
  })



  console.log(moonCountries)
  // console.log(countries.features.map(d => d.geometry))
  // console.log(treatyCountries)

// start making scrollytelling steps

  d3.select('#step-one').on('stepin', () => {
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
        if (outerspaceR.indexOf(country) >= 0) {
          return 'blue'
        } else if (outerspaceS.indexOf(country) >= 0) {
          return 'yellow'
        } else {
          return 'grey'
        }
        // console.log(datapoints.country)
      })
  })
  // svg
  //    .selectAll('.country')
  //    .data(datapoints)
  //    .attr('fill', d => {
  //      console.log(d)
  //      return colorScale(d.ARRA)
  //    })
  
  d3.select('#step-two').on('stepin', () => {
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
        if (rescueAgreementR.indexOf(country) >= 0) {
          return 'blue'
        } else if (rescueAgreementS.indexOf(country) >= 0) {
          return 'yellow'
        } else {
          return 'grey'
        }
        // console.log(datapoints.country)
      })
  })


  d3.select('#step-three').on('stepin', () => {
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
        if (liabilityConventionR.indexOf(country) >= 0) {
          return 'blue'
        } else if (liabilityConventionS.indexOf(country) >= 0) {
          return 'yellow'
        } else {
          return 'grey'
        }
        // console.log(datapoints.country)
      })
  })

  d3.select('#step-four').on('stepin', () => {
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
        if (registrationConventionR.indexOf(country) >= 0) {
          return 'blue'
        } else if (registrationConventionS.indexOf(country) >= 0) {
          return 'yellow'
        } else {
          return 'grey'
        }
        // console.log(datapoints.country)
      })
  })



  d3.select('#step-five').on('stepin', () => {
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
        if (moonCountriesR.indexOf(country) >= 0) {
          return 'blue'
        } else if (moonCountriesS.indexOf(country) >= 0) {
          return 'yellow'
        } else {
          return 'grey'
        }
        // console.log(datapoints.country)
      })
  })









  svg // adding long lat lines to map
    .append('path')
    .datum(graticule())
    .attr('d', path)
    .attr('stroke', 'lightgrey')
    .lower()
}
