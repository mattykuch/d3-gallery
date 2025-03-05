async function drawScatter2024() {

    // 1. Access the data
    // 1.1 Load the data

    const humdew2024 = await d3.csv("../R/data/kiziri/kiziri_humdew_max_2024.csv", d3.autoType) //d3.autoType method automatically changes the max-temp & date to JS format

    // 1.2 Create Accessor for y and x data points

    const yAccessor = d => d.humidity    
    const xAccessor = d => d.dew_point
    const colorAccessor = d => d.cloud_cover

    // console.log(yAccessor(humdew2024[0])); // confirm by console loging

    // console.log(xAccessor(humdew2024[0])); // confirm by console loging
    // console.log(colorAccessor(humdew2024[0])); // confirm by console loging

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
    
    //  console.log(d3.extent(humdew2024, yAccessor)); // confirm by console logging it
    

    // 4.3 Creating the xScale with d3.scaleLinear also

    const xScale = d3.scaleLinear()
      .domain(d3.extent(humdew2024, xAccessor)) // Outputs the min & max values of our dataset2
      .range([0, dimensions.boundedWidth])  // Outputs the max Width value "boundedWidth" of our screen dimension within the bounded area
      .nice()

    // console.log(d3.extent(humdew2024, xAccessor)); // confirm by console logging it

    // 4.4 Creating the colorScale with d3.scaleLinear , once more

    const colorScale = d3.scaleLinear()
    .domain(d3.extent(humdew2024, colorAccessor))
    .range(["skyblue", "darkslategrey"])

    // console.log(d3.extent(humdew2024, colorAccessor)); // confirm by console logging it



    // 5 Draw data
    // 5.1 Generate the scatter points/dots by creating circles for each data point

    // const dots = bounds.selectAll("circle")
    // .data(humdew2024)
    // .enter().append("circle")
    //   .attr("cx", d => xScale(xAccessor(d)))
    //   .attr("cy", d => yScale(yAccessor(d)))
    //   .attr("r", 4)
    //   .attr("fill", "cornflowerblue")

    function drawDots(dataset, color) { // function that draws dots and can be called on any dataset and color

      const dots = bounds.selectAll("circle").data(dataset)

      dots.join("circle") // .join in more recent D3 version can replace .enter().append() method chain
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", 4)
        .attr("fill", d => colorScale(colorAccessor(d))) // Adding a color gradient

    
    }

    drawDots(humdew2024, "darkgrey") // selets only first 200 dots

    // 6. Draw peripherals i.e. axes

    const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const xAxisLabel = xAxis.append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .html("Dew point (&deg;C)")

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(4)

  const yAxis = bounds.append("g")
      .call(yAxisGenerator)

  const yAxisLabel = yAxis.append("text")
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("y", -dimensions.margin.left + 10)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .text("Relative humidity")
      .style("transform", "rotate(-90deg)")
      .style("text-anchor", "middle")

// 6.2 Labelling axes and other text


bounds
.append("text")
.text("2024")
.attr("x", dimensions.width/6)
.attr("y", dimensions.height/5)
.style("opacity", 0.2)
.style("font-size","100px");





}

drawScatter2024()