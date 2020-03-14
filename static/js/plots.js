var trace1 = {
    x: data_death.map(row => row.Year),
    y: data_death.map(row => row.nat_Deaths),
    type: "line"
};
  
var data_death=[trace1]

var layout = {
  title: "National Number of Deaths",
  xaxis: { title: "Year" },
  yaxis: { title: "Number of Deaths"}
};

Plotly.newPlot("line-plot", data_death, layout);