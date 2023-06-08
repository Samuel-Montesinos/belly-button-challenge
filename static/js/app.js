const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// update from dropdown function
function updatePlots(selectedSample) {
  d3.json(url).then(function(data) {
    // getting data for sample
    var sampleData = data.samples.find(function(sample) {
      return sample.id === selectedSample;
    });

    // Update the bar chart
    var barTrace = {
      x: sampleData.sample_values.slice(0, 10).reverse(),
      y: sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: sampleData.otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    };

    var barData = [barTrace];

    Plotly.newPlot('bar', barData);

    // Update the bubble chart
    var bubbleTrace = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: 'Earth'
      }
    };

    var bubbleData = [bubbleTrace];

    Plotly.newPlot('bubble', bubbleData);

    // Update the sample metadata
    var metadata = data.metadata.find(function(sample) {
      return sample.id.toString() === selectedSample;
    });

    var sampleMetadata = d3.select("#sample-metadata");
    sampleMetadata.html("");

    Object.entries(metadata).forEach(function([key, value]) {
      sampleMetadata.append("p").text(`${key}: ${value}`);
    });
  });
}

// Function to handle the dropdown selection change
function optionChanged(selectedSample) {
  updatePlots(selectedSample);
}

// Fetch the JSON data and initialize the page with the default sample
d3.json(url).then(function(data) {
  // Populate the dropdown menu with Test Subject IDs
  var dropdown = d3.select('#selDataset');
  data.names.forEach(function(name) {
    dropdown.append('option').text(name).property('value', name);
  });

  // Get the default sample
  var defaultSample = data.names[0];

  // Update all plots with the default sample
  updatePlots(defaultSample);
});
