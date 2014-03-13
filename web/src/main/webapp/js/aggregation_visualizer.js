/**
 * Created with IntelliJ IDEA.
 * User: daniel_k
 * Date: 2014-03-12
 */


var margin = 10,
    outerDiameter = 360,
    innerDiameter = outerDiameter - margin - margin;

var Aggregation = function (aggregations) {

    console.log("lets");

    $(document).ready(function () {
        $.ajaxSetup({
            cache: false
        });

        var margin = 10,
            outerDiameter = 300,
            innerDiameter = outerDiameter - margin - margin;

        var x = d3.scale.linear()
            .range([0, innerDiameter]);

        var y = d3.scale.linear()
            .range([0, innerDiameter]);

        var color = d3.scale.linear()
            .domain([-1, 5])
            .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
            .interpolate(d3.interpolateHcl);

        var pack = d3.layout.pack()
            .padding(2)
            .size([innerDiameter, innerDiameter])
            .value(function(d) {
                  return d.hits; });


        d3.select("svg")
            .remove();

        var svg = d3.select("#aggs").append("svg")
            .attr("width", outerDiameter)
            .attr("height", outerDiameter)
            .append("g")
            .attr("transform", "translate(" + margin + "," + margin + ")");

//        d3.json(aggregations, function(error, root) {
//            var focus = root,
//                nodes = pack.nodes(root);

        //console.log(JSON.stringify((aggregations)));

        var root = JSON.parse(JSON.stringify((aggregations)));
        var focus = root;
        var nodes = pack.nodes(root);

        svg.append("g").selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .attr("r", function(d) { return d.r; })
            .style("fill", function(d) {  return d.children ? color(d.depth) : null; })
            .on("click", function(d) { return zoom(focus == d ? root : d); });

        svg.append("g").selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("class", "label")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
            .style("display", function(d) { return d.parent === root ? null : "none"; })
            .text(function(d) { return d.name; });

        d3.select(window)
            .on("click", function() { zoom(root); });

        function zoom(d, i) {
            var focus0 = focus;
            focus = d;

            var k = innerDiameter / d.r / 2;
            x.domain([d.x - d.r, d.x + d.r]);
            y.domain([d.y - d.r, d.y + d.r]);
            d3.event.stopPropagation();

            var transition = d3.selectAll("text,circle").transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

            transition.filter("circle")
                .attr("r", function(d) { return k * d.r; });

            transition.filter("text")
                .filter(function(d) { return d.parent === focus || d.parent === focus0; })
                .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
                .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
                .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
            }
        });

        d3.select(self.frameElement).style("height", outerDiameter + "px");
}