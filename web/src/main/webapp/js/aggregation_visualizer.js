/**
 * Created with IntelliJ IDEA.
 * User: daniel_k
 * Date: 2014-03-12
 */


var margin = 10,
    outerDiameter = 360,
    innerDiameter = outerDiameter - margin - margin;

var svg;

var greens = ["approved", "confirmed_not_fraud", "booked_thawed", "suspected_not_fraud"];

var reds = ["denied", "rejected", "confirmed_fraud"];

var yellows = ["suspected_fraud", "manual_inspection", "booked_frozen", "under_manual_inspection"];

var aggregation = function() {

    svg = d3.select("#aggs").append("svg")
        .attr("width", outerDiameter)
        .attr("height", outerDiameter)
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");
}();

var updateAggregation = function (aggregations) {

    console.log("Build aggregation graph");
    if (aggregations === undefined) {
        d3.selectAll("circle").remove();
        return;
    }

    $(document).ready(function () {
        $.ajaxSetup({
            cache: false
        });

        var x = d3.scale.linear()
            .range([0, innerDiameter]);

        var y = d3.scale.linear()
            .range([0, innerDiameter]);

        var color = d3.scale.linear()
            .domain([-1, 5])
            .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
            .interpolate(d3.interpolateHcl);

        var color2 = d3.scale.category20c();

        var pack = d3.layout.pack()
            .sort(d3.descending)
            .padding(4)
            .size([innerDiameter, innerDiameter])
            .value(function(d) {
                  return d.hits; });

        d3.selectAll("circle").remove();

        var root = JSON.parse(JSON.stringify((aggregations)));
        var focus = root;
        var nodes = pack.nodes(root);


        svg.append("g").selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .style("fill", function(d) { return getColor(d); }) // return getColorFromName(d.name, d.depth);}) //d.children ? color2(d.depth) : color2(d.depth); })
            .on("click", function(d) {
                return onLeafClicked(d);
            })
            .attr("r", function(d) { return 0; })
            .transition().ease("elastic",1,1.1).duration(800).attr("r", function(d) { return d.r; });

        svg.append("g").selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("class", "label")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
            .style("display", function(d) { return d.parent === root ? null : "none"; })
            .text(function(d) { return generateText(d); });

//        d3.select(window)
//            .on("dblclick", function() { zoom(root); });

        function shouldFocus(d, focus) {
            if (d === focus || d.parent === focus) {
                return true;
            } else if (d.parent === undefined) {
                return false;
            } else {
                return shouldFocus(d.parent, focus)
            }

        }


        function onLeafClicked(d) {
            if (!d.children) {
                console.log("leaf, filter: " + );
            }
            zoom(d);
        }

        function generateText(d) {
            if (d.hits === undefined) {
                return d.name;
            }
            return d.name + " (" + d.hits + ")";
        }

        function zoom(d, i) {
            var focus0 = focus;
            focus = d;

            var k = innerDiameter / d.r / 2;
            x.domain([d.x - d.r, d.x + d.r]);
            y.domain([d.y - d.r, d.y + d.r]);
            d3.event.stopPropagation();

            var transition = d3.selectAll("text,circle").transition().ease("elastic",1.1,1.1)
                .style("fill-opacity", function(d) { return shouldFocus(d, focus) ? 1 : 0; })
                .duration(d3.event.altKey ? 7500 : 900)
                .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

            transition.filter("circle")
                .attr("r", function(d) { return k * d.r; });

            transition.filter("text")
                //.filter(function(d) { return d.parent === focus || d.parent === focus0; })
                .style("fill-opacity", function(d) { return (d.parent === focus || (!d.children && d === focus)) ? 1 : 0; })
                .each("start", function(d) { if (d.parent === focus || (!d.children && d === focus)) {this.style.display = "inline";} else  {this.style.display = "none";} })
                .each("end", function(d) {
                    if (d === focus) {
                        this.style.display = "inline";
                    } else if (d.parent !== focus) {
                        this.style.display = "none";
                    }
                    });
            }

        function getColor(d) {
            var comp = d.name.toLowerCase();
            if (greens.indexOf(comp) != -1) {
                return "#8DF293";
            }
            else if (reds.indexOf(comp) != -1) {
                return "#F24646";
            }
            else if (yellows.indexOf(comp) != -1) {
                return "#F2F18D";
            } else {
                return color2(d.depth);
            }
        }

        });

        d3.select(self.frameElement).style("height", outerDiameter + "px");
}