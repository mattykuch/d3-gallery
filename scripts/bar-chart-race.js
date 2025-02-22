// Sample data for bar chart race
const dataset = [];
        
// Generate sample data
const countries = ['USA', 'China', 'Japan', 'Germany', 'UK', 'France', 'India', 'Italy', 'Brazil', 'Canada', 'South Korea', 'Russia', 'Australia'];
const years = Array.from({length: 21}, (_, i) => 2000 + i);

// Generate synthetic GDP data
countries.forEach(country => {
    // Base value with country variation
    let baseValue = 1000 + Math.random() * 9000;
    
    // Different growth patterns for different countries
    let growthRate;
    if (country === 'China' || country === 'India') {
        growthRate = 1.08 + Math.random() * 0.04; // Fast growth
    } else if (country === 'USA' || country === 'Germany') {
        growthRate = 1.02 + Math.random() * 0.01; // Steady growth
    } else {
        growthRate = 1.01 + Math.random() * 0.02; // Moderate growth
    }
    
    years.forEach(year => {
        // 2008-2009 recession effect
        let recessionFactor = 1;
        if (year === 2008 || year === 2009) {
            recessionFactor = 0.95 - Math.random() * 0.05;
        }
        
        // Calculate value for this year
        baseValue = baseValue * growthRate * recessionFactor;
        
        // Add some random variation
        const value = baseValue * (0.95 + Math.random() * 0.1);
        
        dataset.push({
            name: country,
            year: year,
            value: Math.round(value)
        });
    });
});

// Visualization parameters
let currentYear = 2000;
let animationId = null;
const transitionDuration = 750;
const barHeight = 40;

// Set up SVG
const margin = {top: 30, right: 30, bottom: 30, left: 150};
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Add title
svg.append("text")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("GDP by Country (2000-2020)");
    
// Create scales
const xScale = d3.scaleLinear()
    .domain([0, 20000])
    .range([0, width]);
    
const colorScale = d3.scaleOrdinal()
    .domain(countries)
    .range(d3.schemeTableau10);
    
// Add year display
const yearLabel = svg.append("text")
    .attr("x", width - 50)
    .attr("y", height - 20)
    .attr("text-anchor", "end")
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .text(currentYear);
    
// Function to update the chart for a specific year
function updateChart(year) {
    currentYear = year;
    
    // Get top 10 countries for this year
    const yearData = dataset.filter(d => d.year === year)
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
        
    // Update x scale domain
    const maxValue = d3.max(yearData, d => d.value);
    xScale.domain([0, maxValue * 1.1]);
    
    // Update bars
    const bars = svg.selectAll(".bar")
        .data(yearData, d => d.name);
        
    // Remove exiting bars
    bars.exit().remove();
    
    // Update existing bars
    bars.transition()
        .duration(transitionDuration)
        .attr("y", (d, i) => i * barHeight)
        .attr("width", d => xScale(d.value));
        
    // Enter new bars
    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", (d, i) => i * barHeight)
        .attr("height", barHeight - 5)
        .attr("x", 0)
        .attr("fill", d => colorScale(d.name))
        .attr("width", 0)
        .transition()
        .duration(transitionDuration)
        .attr("width", d => xScale(d.value));
        
    // Update country labels
    const labels = svg.selectAll(".label")
        .data(yearData, d => d.name);
        
    labels.exit().remove();
    
    labels.transition()
        .duration(transitionDuration)
        .attr("y", (d, i) => i * barHeight + barHeight / 2 + 5);
        
    labels.enter()
        .append("text")
        .attr("class", "label")
        .attr("x", -10)
        .attr("y", (d, i) => i * barHeight + barHeight / 2 + 5)
        .attr("text-anchor", "end")
        .text(d => d.name);
        
    // Update value labels
    const valueLabels = svg.selectAll(".value")
        .data(yearData, d => d.name);
        
    valueLabels.exit().remove();
    
    valueLabels.transition()
        .duration(transitionDuration)
        .attr("y", (d, i) => i * barHeight + barHeight / 2 + 5)
        .attr("x", d => xScale(d.value) + 5)
        .text(d => d3.format(",d")(d.value));
        
    valueLabels.enter()
        .append("text")
        .attr("class", "value")
        .attr("x", d => xScale(d.value) + 5)
        .attr("y", (d, i) => i * barHeight + barHeight / 2 + 5)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle")
        .text(d => d3.format(",d")(d.value));
        
    // Update year label
    yearLabel.text(year);
}

// Initialize chart with first year
updateChart(2000);

// Control animation
let animationSpeed = 500; // ms between years

function startAnimation() {
    if (animationId) clearInterval(animationId);
    
    animationId = setInterval(() => {
        if (currentYear < 2020) {
            updateChart(currentYear + 1);
        } else {
            clearInterval(animationId);
            animationId = null;
            document.getElementById("play-btn").textContent = "Play Animation";
        }
    }, animationSpeed);
}

// Event listeners for controls
document.getElementById("play-btn").addEventListener("click", function() {
    if (animationId) {
        clearInterval(animationId);
        animationId = null;
        this.textContent = "Play Animation";
    } else {
        if (currentYear >= 2020) {
            updateChart(2000);
        }
        startAnimation();
        this.textContent = "Pause";
    }
});

document.getElementById("reset-btn").addEventListener("click", function() {
    if (animationId) {
        clearInterval(animationId);
        animationId = null;
        document.getElementById("play-btn").textContent = "Play Animation";
    }
    updateChart(2000);
});

document.getElementById("speed").addEventListener("input", function() {
    animationSpeed = 1000 - (this.value * 90);
    if (animationId) {
        clearInterval(animationId);
        startAnimation();
    }
});

document.getElementById("year-select").addEventListener("change", function() {
    if (animationId) {
        clearInterval(animationId);
        animationId = null;
        document.getElementById("play-btn").textContent = "Play Animation";
    }
    updateChart(parseInt(this.value));
});