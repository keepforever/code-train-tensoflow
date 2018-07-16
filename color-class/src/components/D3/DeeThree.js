import React, { Component } from 'react';
import * as topojson from 'topojson';
import * as d3 from 'd3';
import { queue } from 'd3-queue';

import usData from "./us.json";
import usCongress from './us-congress-113.json';

class DeeThree extends Component {


  componentDidUpdate() {
    const svg = d3.select(this.refs.anchor)
    const width = 960,
          height = 600;
    // tells us how to shape our map
    const projection = d3.geoAlbers()
                         .scale(1280)
                         .translate([width / 2, height / 2]);

    const path = d3.geoPath(projection);

    //copy paste code is expecting vars to be named differently, rename here:
    const us = usData
    const congress = usCongress

    svg.append("defs").append("path")
      .attr("id", "land")
      .datum(topojson.feature(us, us.objects.land))
      .attr("d", path);

    svg.append("clipPath")
        .attr("id", "clip-land")
      .append("use")
        .attr("xlink:href", "#land");

    svg.append("g")
        .attr("class", "districts")
        .attr("clip-path", "url(#clip-land)")
      .selectAll("path")
        .data(topojson.feature(congress, congress.objects.districts).features)
      .enter().append("path")
        .attr("d", path)
      .append("title")
        .text(function(d) { return d.id; });

    svg.append("path")
        .attr("class", "district-boundaries")
        .datum(topojson.mesh(congress, congress.objects.districts, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); }))
        .attr("d", path);

    svg.append("path")
        .attr("class", "state-boundaries")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("d", path);
  }

  render () {

    if(!usData || !usCongress) {
      return <h1>Loading...</h1>
    }
    return (
      <svg ref="anchor" width="100%" height="200px" style={{border: '1px solid red'}}>

      </svg>
    )
  }
}

export default DeeThree
