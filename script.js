const url =
	"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const getData = async () => {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Fetch error: ", error);
	}
};

getData().then((data) => {
    const dataset = data.data;
    const width = 900;
    const height = 460;
    const padding = 40;

    // Declare domain and range for x-axis
    const xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .range([padding, width - padding])
        .padding(0.1);

    // Declare domain and range for y-axis
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d[1])])
        .range([height - padding, padding]);

    // Create svg background
    const svg = d3
        .select(".visHolder")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create tooltips display content
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("display", "none");

    // Create bars for bar chart
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - padding - yScale(d[1]))
        .attr("fill", "#34ACFF")
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html(`Date: ${d[0]}<br>$${d[1]} Billion`);
        })
        .on("mousemove", (event) => {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => {
            tooltip.style("display", "none");
        });

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(d3.axisBottom(xScale).tickFormat((d, i) => dataset[i][0]));

    // Add y-axis
    svg.append("g")
        .attr("transform", `translate(${padding}, 0)`)
        .call(d3.axisLeft(yScale));
    
    // Create label for y-axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", padding + 50)
    .attr("x", -padding - 100)
    .attr("dy", "-1em")
    .style("text-anchor", "middle")
    .text("Gross Domestic Product");
});
