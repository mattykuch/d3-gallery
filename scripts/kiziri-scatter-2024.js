async function drawScatter2024() {

    // 1. Access the data
    // 1.1 Load the data

    const humdew2024 = await d3.csv("../R/data/kiziri/kiziri_humdew_max_2024.csv", d3.autoType) //d3.autoType method automatically changes the max-temp & date to JS format

    // 1.2 Create Accessor for y and x data points

    yAccessor = d => d.humidity    
    xAccessor = d => d.dew_point

    // console.log(yAccessor(humdew2024[0])); // confirm by console loging

    // console.log(xAccessor(humdew2024[0])); // confirm by console loging

    // 2. Create chart dimensions
    // 2.1 Store the dimensions that wraps around the 1st layer "wrapper" of the chart (width, height and margins) in an array

    const width = d3.min([ // we want the scatterplot to be in a square canvas, so we use d3.min to decide which is smaller (height or width) and make that the width of the square
        window.innerWidth * 0.9,
        window.innerHeight * 0.9,
      ])
    
    let dimensions = {
        width: width, // Use the innerwidth of the screen-window to determine the width
        height: width,
        margin: { // The margin between the wrapper layer and the inner boundary i.e. 2nd layer
          top: 10,
          right: 10,
          bottom: 50, // Creates room for the x-axis
          left: 50, // Creates room for the y-axis
        },
      }

    // 2.1 Include the relative dimensions of the inner boundary "bounded" - the 2nd layer of the chart area

    dimensions.boundedWidth = dimensions.width - dimensions.margin.right - dimensions.margin.left
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    // 3 Draw the canvas
    // 3.1 Drawing the svg wrapper layer, based on set dimensions and append it to the "line-chart-2" div

    const wrapper = d3.select("#kiziri-scatter-1") 
      .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    // 3.2 Draw the "g" / "bounds" layer inside the svg, where the axes will be rendered later

    const bounds = wrapper.append("g") 
    .style("transform", `translate(${ // Moves the "g" element to fit within the wrapper
        dimensions.margin.left
    }px, ${
        dimensions.margin.top
    }px)`)


    // 4 Draw the scales 
    // 4.1 Creating the yScale using d3.scaleLinear method to map the min & max of our dataset (i.e. domain) to our screen dimensions (i.e. range)

    const yScale = d3.scaleLinear()
      .domain(d3.extent(humdew2024, yAccessor)) // Outputs the min & max values of our dataset2
      .range([dimensions.boundedHeight, 0]) // Outputs the max Height value "boundedHeight" of our screen dimension within the bounded area
      .nice() // a d3 function that rounds up the scales domain
    
      console.log(d3.extent(humdew2024, yAccessor)); // confirm by console logging it
    

    // 4.3 Creating the xScale with d3.scaleLinear also

    const xScale = d3.scaleLinear()
      .domain(d3.extent(humdew2024, xAccessor)) // Outputs the min & max values of our dataset2
      .range([0, dimensions.boundedWidth])  // Outputs the max Width value "boundedWidth" of our screen dimension within the bounded area
      .nice()

     console.log(d3.extent(humdew2024, xAccessor)); // confirm by console logging it


    // 5 Draw data
    // 5.1 Generate the scatter points/dots by creating circles for each data point

    const dots = bounds.selectAll("circle")
    .data(humdew2024)
    .enter().append("circle")
      .attr("cx", d => xScale(xAccessor(d)))
      .attr("cy", d => yScale(yAccessor(d)))
      .attr("r", 4)
      .attr("fill", "cornflowerblue")

    // 6. Draw peripherals i.e. axes

}

drawScatter2024()