var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 40,
  right: 60,
  bottom: 100,
  left: 100
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

  var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var chosenXAxis = "obesity_percentage";
  // var chosenYAxis = "year";

  function xScale(causesData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(causesData, d => d[chosenXAxis]) * 0.8,
        d3.max(causesData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;

  }


  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
      // .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
  }

  function renderCirclesTextGroup(circlesTextGroup, newXScale, chosenXAxis) {
    circlesTextGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));
      // .attr("y", d => newYScale(d[chosenYAxis]));
    
      return circlesTextGroup;
  }
  function updateToolTip(chosenXAxis,circlesGroup) {

    if (chosenXAxis === "obesity_percentage") {
      var xLabel = "Obesity:";
    }
    else if (chosenXAxis === "tobacco_percentage") {
      var xLabel = "Tobacco use:";
    }
    else {
        var xLabel = "Per capita Income:";
    }
    
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      }); 
    return circlesGroup;
  }
  
  d3.json("merged_results.json").then(function(causesData, err) {
    if (err) throw err;
  console.log(causesData);
  
    // parse data
    causesData.forEach(function(data) {
        data.state= +data.state;
        data.year = +data.year;
        data.obesity_percentage= +data.obesity_percentage;
        data.tobacco_percentage = +data.tobacco_percentage;
        data.per_capita_income = +data.per_capita_income;
        data.Deaths = +data.Deaths;
    });
    
    // LinearScale function above csv import
    var xLinearScale = xScale(causesData, chosenXAxis);
    // var yLinearScale = yScale(causesData, chosenYAxis);
  
    var yLinearScale = d3.scaleLinear()
    .domain([3000, d3.max(causesData, d => d.Deaths)])
    .range([height, 0]);
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    chartGroup.append("g")
    .call(leftAxis);

  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(causesData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d.Deaths))
      .attr("r", "18")
      .classed("stateCircle", true);

    var circlesTextGroup = chartGroup.append("text").classed("stateText", true)
    .selectAll("tspan")
    .data(causesData)
    .enter()
    .append("tspan")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.Deaths))
    .style("font-size", "8px")
    .text(d => d.state)
    .style("font-weight", "bold");

  
    // Create group for  3 x- axis labels and 3 y-axis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
    // var ylabelsGroup = chartGroup.append("g")
    //   .attr("transform", `translate(0, 0)`);
  
    var obesityLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "obesity_percentage")
      .classed("active", true)
      .text("Obesity");
  
    var tobaccoLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "tobacco_percentage") 
      .classed("inactive", true)
      .text("Tobacco use");
    
    var incomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "per_capita_income") 
      .classed("inactive", true)
      .text("Per Capita Income");

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Number of Deaths");  
  
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
  
          // functions here found above json import
          // updates scales for new data
          xLinearScale = xScale(causesData, chosenXAxis);
    
  
          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);
     
  
          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
          circlesTextGroup = renderCirclesTextGroup(circlesTextGroup, xLinearScale, chosenXAxis);
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenXAxis === "obesity_percentage") {
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            tobaccoLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "tobacco_percentage") {
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            tobaccoLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            tobaccoLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
  }).catch(function(error) {
    console.log(error);
  });
