var updateFacets = function (aggregations) {

    if (aggregations === undefined) {
        return;
    }


    $('#facets').empty();


    for (var x = 0; aggregations.length > x; x++) {
        updateFacetsChildren(aggregations[x], 0);

    }

}


var updateFacetsChildren = function (children, amt,field) {

    if (children.hits) {
        console.log(children.hits);
        $("<li onclick=\"alert('" + children.name + ""+field+ "')\" class=\"list-group-item list-group-item-facets\">" + createSpaces(amt) + children.name + "<span class=\"badge badge-facets\">" + children.hits + "</span></li>").appendTo('#facets');
    } else if (children.name) {
        $("<li  class=\"list-group-item list-group-item-facets\">" + createSpaces(amt) + children.name + "</li>").appendTo('#facets');
    }
    if (children.children) {
        amt++;
        for (var x = 0; children.children.length > x; x++)
            updateFacetsChildren(children.children[x], amt,children.name);
    }
}

function createSpaces(amt) {
    var spaces = "";
    for (var x = 0; amt > x; x++) {
        spaces = spaces + "&nbsp;&nbsp;&nbsp";
    }
    return spaces;
}