
var n = 40,
  data = Array(n+1).fill(0);

var svg = d3.select("#chart"),
  width = svg.attr("width"),
  height = svg.attr("height"),
  g = svg.append("g");

var x = d3.scaleLinear()
  .domain([0, n])
  .range([0, 600]);

var y = d3.scaleLinear()
  .domain([0, 100])
  .range([100, 0]);

var line = d3.line()
  .x(function (d, i) { return x(i); })
  .y(function (d, i) { return y(d); });

// define gradient
var defs = svg.append("defs");

var gradient = defs.append("linearGradient")
  .attr("id", "svgGradient")
  .attr("gradientUnits", "userSpaceOnUse")
  .attr("x1", 0)
  .attr("x2", 0)
  .attr("y1", y(100))
  .attr("y2", y(0))
  .selectAll("stop")
    .data([
      {offset: "0%",   color: "red",     opacity: 0.2},
      {offset: "100%", color: "#6F00F6", opacity: 0.8}
    ])
  .enter().append("stop")
    .attr("offset", function(d){ return d.offset; })
    .attr("stop-color", function(d){ return d.color; })
    .attr("stop-opacity", function(d){ return d.opacity; });

g.append("defs").append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", width)
  .attr("height", height);

g.append("g")
  .attr("clip-path", "url(#clip)")
  .append("path")
  .datum(data)
  .attr("class", "line")
  .transition()
  .duration(1000)
  .attr("stroke-width", 7)
  .attr("stroke", "url(#svgGradient)")
  .attr("fill", "none")
  .attr("")
  .ease(d3.easeLinear)
  .on("start", tick);

var highestHashrate = 0;

function tick() {
  let hashrate = currentHashrate ? currentHashrate : 0;

  data.push(hashrate);

  if (hashrate > highestHashrate) {
    highestHashrate = hashrate;
  }

  if (highestHashrate * 0.75 > Math.max.apply(Math, data)) {
    highestHashrate = highestHashrate * 0.75;
  }

  let x2 = d3.scaleLinear()
    .domain([0, n])
    .range([0, 600]);

  const min = 0;
  let max = highestHashrate * 1.1 + 1;

  let y2 = d3.scaleLinear()
    .domain([min, max])
    .range([100, 0]);

  let line2 = d3.line()
    .x(function (d, i) { return x2(i); })
    .y(function (d, i) { return y2(d); });

  // Redraw the line.
  d3.select(this)
    .attr("d", line2)
    .attr("transform", null);

  // Slide it to the left.
  d3.active(this)
    .attr("transform", "translate(" + x(-1) + ",0)")
    .transition()
    .on("start", tick);

  // Pop the old data point off the front.
  data.shift();
}
