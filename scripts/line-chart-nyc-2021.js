
async function drawLineChart2021() {

    // 1. Access the data
    // 1.1 Load the data

    const dataset2 = await d3.csv("../data/nyc_weekly_temperature.csv", d3.autoType) //d3.autoType method automatically changes the max-temp & date to JS format
    
    // 1.2 Create Accessor for y and x data points

    yAccessor = d => d.max_temp_F    
    xAccessor = d => d.date

    // console.log(yAccessor(dataset2[0])); // confirm by console loging

    // console.log(xAccessor(dataset2[0])); // confirm by console loging

    // 2. Create chart dimensions
    // 2.1 Store the dimensions that wraps around the 1st layer "wrapper" of the chart (width, height and margins) in an array

    let dimensions = {
        width: window.innerWidth * 0.9, // Use the innerwidth of the screen-window to determine the width
        height: 400,
        margin: { // The margin between the wrapper layer and the inner boundary i.e. 2nd layer
          top: 15,
          right: 15,
          bottom: 40,
          left: 60,
        },
      }

    // 2.1 Include the relative dimensions of the inner boundary "bounded" - the 2nd layer of the chart area

    dimensions.boundedWidth = dimensions.width - dimensions.margin.right - dimensions.margin.left
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    // 3 Draw the canvas
    // 3.1 Drawing the svg wrapper layer, based on set dimensions and append it to the "line-chart-2" div

    const wrapper = d3.select("#line-chart-2") 
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
      .domain(d3.extent(dataset2, yAccessor)) // Outputs the min & max values of our dataset2
      .range([dimensions.boundedHeight, 0]) // Outputs the max Height value "boundedHeight" of our screen dimension within the bounded area

    // console.log(d3.extent(dataset2, yAccessor)); // confirm by console logging it
    

    // 4.3 Creating the xScale with d3.scaleTime() method since we are dealing with dates

    const xScale = d3.scaleTime()
      .domain(d3.extent(dataset2, xAccessor)) // Outputs the min & max values of our dataset2
      .range([0, dimensions.boundedWidth])  // Outputs the max Width value "boundedWidth" of our screen dimension within the bounded area

    // console.log(d3.extent(dataset2, xAccessor)); // confirm by console logging it

      // 5 Draw data
    // 5.1 Generate the line with the d3.line() method
  
    const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))

    // 5.2 Generate the path by passing the lineGenerator variable into the "d" attribute - dont forget to include the dataset2
    const line = bounds.append("path")
      .attr("d", lineGenerator(dataset2))
      .attr("fill", "none")
      .attr("stroke", "#af9358")
      .attr("stroke-width", 2)

    // 6. Draw peripherals i.e. axes
  
    const yAxisGenerator = d3.axisLeft() // Create the y axis using d3.axisLeft() method
      .scale(yScale) // Dont forget to scale it
  
    const yAxis = bounds.append("g") // Append it to "g" element and then call the yAxisGenerator to draw it
      .call(yAxisGenerator)
  
    const xAxisGenerator = d3.axisBottom() // Create the x axis using d3.axisBottom() method
      .scale(xScale) // Dont forget to scale it
  
    const xAxis = bounds.append("g") // Append it to the "g" element, then call the xAxisGenerator to draw it
      .call(xAxisGenerator)
        .style("transform", `translateY(${ // This moves the xAxis from the top to the bottom of the screen
          dimensions.boundedHeight
        }px)`)    
}

drawLineChart2021();