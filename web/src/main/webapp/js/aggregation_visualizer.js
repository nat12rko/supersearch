/**
 * Created with IntelliJ IDEA.
 * User: daniel_k
 * Date: 2014-03-12
 */


var margin = 10,
    outerDiameter = 960,
    innerDiameter = outerDiameter - margin - margin;

var Aggregation = function (id) {

    $(document).ready(function () {
        $.ajaxSetup({
            cache: false
        });

        var svg = d3.select("aggregations").append("svg")
            .attr("width", outerDiameter)
            .attr("height", outerDiameter)
            .append("g")
            .attr("transform", "translate(" + margin + "," + margin + ")");


    });

    function updateAggregation() {


    };

}