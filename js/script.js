var currentGraph = "tree"
var currentStructureTree = "trail1";
var currentStructureSankey = "trail1";
var currentOrder = "Sized";
var currentYear = "2016";

var treeSequence = '<p>Select one of the three following options to view the data:</p>' +
    '<svg onclick="dataLoadTree(this.id)" id="trail1" width="700" height="50"></svg>' +
    '<svg onclick="dataLoadTree(this.id)" id="trail2" width="700" height="50"></svg>' +
    '<svg onclick="dataLoadTree(this.id)" id="trail3" width="700" height="50"></svg>';

var sankeySequence = '<p>Select one of the two following options to view the data:</p>' +
    '<svg onclick="dataLoadSankey(this.id)" id="trail1" width="700" height="50"></svg>' +
    '<svg onclick="dataLoadSankey(this.id)" id="trail2" width="700" height="50"></svg>';

var treeInstruction = "The graph shows grants awarded to various disciplines and provinces. The total investment is represented by the centre circle. Moving outward, each circle represents information on the distribution of funds.<br><br>&#9658 Select an order of the data categories by clicking on the sequences in the legend.<br>&#9658 Hover over each section to view related investments.<br>&#9658 Click on each section to move that section to the centre of the graph.<br>&#9658 Click on the circle at the center of the graph to zoom out.<br>&#9658 Click on the button below the graph to switch to the other visualization"

var sankeyInstruction = "The graph shows the grants awarded to various disciplines and provinces. The total investment is represented by the yellow rectangle. Moving to the right, each rectangle represents the total amount allocated to different recipients, sections or provinces and the links show how the funds are being distributed.<br><br>&#9658 Click on the rectangles in the third column to further expand the graph.<br>&#9658 Hover over each rectangle to view the related investments.<br>&#9658 Hover over the links to view how the funds are being distributed.<br>&#9658 Select an order of the data categories by clicking on the sequences in the legend.<br>&#9658 Click on the buttons in the legend to sort the data by size or alphabetically."


//Load Treemap first
d3.select("#instruction").html(treeInstruction);
d3.select("#sequence").html(treeSequence);
dataLoadTree(currentStructureTree);

function switchGraph() {
    
    currentGraph = (currentGraph == "tree" ? "sankey" : "tree")

    if (currentGraph == "tree") {

        d3.select("#instruction").html(treeInstruction);
        d3.select("#sequence").html(treeSequence);
        dataLoadTree(currentStructureTree);
        document.getElementById("data-order-text").innerHTML = ""
    } else {
        d3.select("#instruction").html(sankeyInstruction);
        d3.select("#sequence").html(sankeySequence);
        dataLoadSankey(currentStructureSankey)

        document.getElementById("data-order-text").innerHTML = "Select to sort the data:"
        drawButtons();

        d3.select("#button1").on("click", function () {
            currentOrder = "Sized";
            document.getElementById("button1").firstChild.style.fill = '#009add';
            document.getElementById("button1").lastChild.style.fill = '#fff';

            document.getElementById("button2").firstChild.style.fill = '#9f9fa3';
            document.getElementById("button2").lastChild.style.fill = '#dcdcdc';


            dataLoadSankey(currentStructureSankey);
        })

        d3.select("#button2").on("click", function () {
            currentOrder = "Alphabetical";
            document.getElementById("button2").firstChild.style.fill = '#009add';
            document.getElementById("button2").lastChild.style.fill = '#fff';

            document.getElementById("button1").firstChild.style.fill = '#9f9fa3';
            document.getElementById("button1").lastChild.style.fill = '#dcdcdc';


            dataLoadSankey(currentStructureSankey);
        })

    }

}

function changeYear() {
    currentYear = document.getElementById("year-choice").value.toString();
    currentGraph == "tree" ? dataLoadTree(currentStructureTree) : dataLoadSankey(currentStructureSankey);
}


function dataLoadTree(structure) {

    switch (structure) {
        case "trail1":
            d3.json("/data/treemapdata1" + currentYear + ".json", function (error, root) {
                treeGraph(error, root);
            });
            document.getElementById("trail1").style.opacity = 1;
            document.getElementById("trail2").style.opacity = 0.4;
            document.getElementById("trail3").style.opacity = 0.4;
            break;
        case "trail2":
            d3.json("/data/treemapdata2" + currentYear + ".json", function (error, root) {
                treeGraph(error, root);
            });
            document.getElementById("trail1").style.opacity = 0.4;
            document.getElementById("trail2").style.opacity = 1;
            document.getElementById("trail3").style.opacity = 0.4;
            break;
        case "trail3":
            d3.json("/data/treemapdata3" + currentYear + ".json", function (error, root) {
                treeGraph(error, root);
            });
            document.getElementById("trail1").style.opacity = 0.4;
            document.getElementById("trail2").style.opacity = 0.4;
            document.getElementById("trail3").style.opacity = 1;
            break;
    }
    currentStructureTree = structure;
}

function dataLoadSankey(structure) {

    switch (structure) {
        case "trail1":
            d3.json("/data/sankeydata1" + currentOrder + currentYear + ".json", function (error, json) {
                sankeyGraph(error, json);
            });
            document.getElementById("trail1").style.opacity = 1;
            document.getElementById("trail2").style.opacity = 0.4;
            break;
        case "trail2":
            d3.json("/data/sankeydata2" + currentOrder + currentYear + ".json", function (error, json) {
                sankeyGraph(error, json);
            });
            document.getElementById("trail1").style.opacity = 0.4;
            document.getElementById("trail2").style.opacity = 1;
            break;
    }
    currentStructureSankey = structure;

}

/////////////////////////////////////////////////////////Treemap Diagram////////////////////////////////////////////////////////////////


function treeGraph(error, root) {

    d3.select(".graph").selectAll("*").remove();
    d3.select("#data-order-text").selectAll("*").remove();
    d3.select("#data-order-buttons").selectAll("*").remove();

    var labelsFont = (window.innerWidth > 1000 ? '10px' : '8px');

    var levels = [[{
                name: "Total",
                color: '#002060'
        },
            {
                name: "Recipients",
                color: '#3399cc'
        },
            {
                name: "Sections",
                color: '#adafbf'
        },
            {
                name: "Regions",
                color: '#fad67b'
        }],
              [{
                name: "Total",
                color: '#002060'
        },
            {
                name: "Sections",
                color: '#adafbf'
        },
            {
                name: "Regions",
                color: '#fad67b'
        },
            {
                name: "Recipients",
                color: '#3399cc'
        }],
              [{
                name: "Total",
                color: '#002060'
        },
            {
                name: "Regions",
                color: '#fad67b'
        },
            {
                name: "Sections",
                color: '#adafbf'
        },
            {
                name: "Recipients",
                color: '#3399cc'
        }]
             ];

    var trails = ["#trail1", "#trail2", "#trail3"];


    for (var i = 0; i < 3; i++) {
        drawSequences(i, trails[i], levels);
    }

    
    var width = window.innerWidth * 0.66,
        height = (window.innerWidth > window.innerHeight ? window.innerHeight * 0.75 : width),
        radius = Math.min(width, height) / 2;

    d3.select(self.frameElement).style("height", height + "px");


    var x = d3.scale.linear()
        .range([0, 2 * Math.PI]);

    var y = d3.scale.sqrt()
        .range([0, radius]);

    // Keep track of the node that is currently being displayed as the root.
    var node;


    var svg = d3.select(".graph").attr("id","graph-tree").append("svg")
        .attr("width", width)
        .attr("height", height + 20)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

    var partition = d3.layout.partition()
        .sort(null)
        .value(function (d) {
            return d.size;
        });


    var arc = d3.svg.arc()
        .startAngle(function (d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
        })
        .endAngle(function (d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
        })
        .innerRadius(function (d) {
            return Math.max(0, y(d.y));
        })
        .outerRadius(function (d) {
            return Math.max(0, y(d.y + d.dy));
        });

    node = root;

    var g = svg.selectAll("g")
        .data(partition.nodes(root))
        .enter().append("g");

    var path = g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            switch (currentStructureTree) {
                case "trail1":
                    return levels[0][d.depth].color;
                    break;
                case "trail2":
                    return levels[1][d.depth].color;
                    break;
                case "trail3":
                    return levels[2][d.depth].color;
                    break;
            }
        })
        .on("click", click)
        .on("mouseover", showValues)
        .on("mouseout", hideValues)
        .each(stash);

    var text = g.append("text")
        .attr("display", function (d) {
            return d.dx > 0.01 ? 'block' : 'none';
        })
        .attr("transform", function (d) {
            return d.name == "Total Investments" ? "rotate(0)" : "translate(" + arc.centroid(d) + ")" + "rotate(" + computeTextRotation(d) + ")";
        })
        .attr("fill", function (d) {
            return d.name == "Total Investments" ? 'white' : 'black';
        })
        .attr("font-size", function (d) {
            return d.name == "Total Investments" ? '14px' : labelsFont;
        })
        .style("font-weight","600")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em") // vertical-align
        .text(function (d) {
            return d.name;
        })
        .on("click", click)
        .on("mouseover", showValues)
        .on("mouseout", hideValues);


    function click(d) {

        node = d;
        var paths = [];

        // fade out all text elements
        text.transition().attr("display", 'none');

        path.transition()
            .duration(1000)
            .attrTween("d", arcTweenZoom(d))
            .each("end", function (e, i) {

                // check if the animated element's data e lies within the visible angle span given in d
                if (e.x >= d.x && e.x < (d.x + d.dx)) {
                    // get a selection of the associated text element
                    var arcText = d3.select(this.parentNode).select("text");
                    // fade in the text element and recalculate positions
                    arcText.transition()
                        .duration(1000)
                        .attr("display", function () {
                            if (node.parent && node.parent.name == e.name) {
                                return 'none';
                            } else {
                                return e.dx / node.dx > 0.01 ? 'block' : 'none';
                            }
                        })
                        .attr("transform", function (d) {
                            return d == node ? "translate(" + 2 * y(d.y) + ")" + "rotate(0)" : "translate(" + arc.centroid(d) + ")" + "rotate(" + computeTextRotation(d) + ")";
                        })
                        .attr("fill", function (d) {
                            return d.name == "Total Investments" ? 'white' : 'black';
                        })
                        .attr("font-size", function (d) {
                            return d.name == "Total Investments" ? '14px' : labelsFont;
                        })
                        .attr("text-anchor", "middle")
                        .text(function (d) {
                            return d.name;
                        });
                }
            });
    }

    // Setup for switching data: stash the old values for transition.
    function stash(d) {
        d.x0 = d.x;
        d.dx0 = d.dx;
    }

    // When switching data: interpolate the arcs in data space.
    function arcTweenData(a, i) {
        var oi = d3.interpolate({
            x: a.x0,
            dx: a.dx0
        }, a);

        function tween(t) {
            var b = oi(t);
            a.x0 = b.x;
            a.dx0 = b.dx;
            return arc(b);
        }

        if (i == 0) {
            // If we are on the first arc, adjust the x domain to match the root node
            // at the current zoom level. (We only need to do this once.)
            var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
            return function (t) {
                x.domain(xd(t));
                return tween(t);
            };
        } else {
            return tween;
        }
    }

    // When zooming: interpolate the scales.
    function arcTweenZoom(d) {
        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
            yd = d3.interpolate(y.domain(), [d.y, 1]),
            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
        return function (d, i) {
            return i ?
                function (t) {
                    return arc(d);
                } :
                function (t) {
                    x.domain(xd(t));
                    y.domain(yd(t)).range(yr(t));
                    return arc(d);
                };
        };
    }

    function computeTextRotation(d) {
        var angle = (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180
        return (angle > 90 ? (angle - 180) : angle);
    }

    function computeTextPosition(d) {
        var angle = (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180
        return (angle > 90 ? -y(d.y) : y(d.y));

    }



    function showValues(d) {

        //Show values on top of the graph
        var label = d3.select("#show-values");

        label.append("p")
            .attr("id", "value1")
            .text(d.fullname);

        label.append("p")
            .attr("id", "value2")
            .text("Amount: $" + d.size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))

        label.append("p")
            .attr("id", "value3")
            .text(function () {
                if (d.parent) {
                    return (d.size / d.parent.size * 100).toFixed(2) + "% of " + d.parent.fullname;
                } else {
                    return "";
                }
            });
    }

    function hideValues() {
        d3.select("#show-values").selectAll("*").remove();
    }

}


/////////////////////////////////////////////////////////Sankey Diagram////////////////////////////////////////////////////////////////

        

function sankeyGraph(error, json) {

    d3.select(".graph").selectAll("*").remove();

    var colors = {
        'Total': '#fad67b',
        'Individual': '#3399cc',
        'Organisation': '#3399cc',
        'section': '#adafbf',
        'province': '#002060',
        'fallback': '#9f9fa3'
    };

    var levels = [[
            {
                name: "Total",
                color: '#fad67b'
        },
            {
                name: "Recipients",
                color: '#3399cc'
        },
            {
                name: "Sections",
                color: '#adafbf'
        },
            {
                name: "Regions",
                color: '#002060'
        }],
        [{
                name: "Total",
                color: '#fad67b'
        },
            {
                name: "Recipients",
                color: '#3399cc'
        },
            {
                name: "Regions",
                color: '#002060'
        },
            {
                name: "Sections",
                color: '#adafbf'
        }]
             ];

    var trails = ["#trail1", "#trail2"];


    for (var i = 0; i < 2; i++) {
        drawSequences(i, trails[i], levels);
    }
    
    var width = window.innerWidth * 0.66,
        height = window.innerHeight * 0.66;

    var chart = d3.select(".graph").attr("id","graph-sankey").append("svg").attr("height", Math.min(height,500)+50).attr("width", Math.max(width,750)).chart("Sankey.Path");
    chart
        .name(label)
        .colorNodes(function (name, node) {
            return color(node, 1) || colors.fallback;
        })
        .colorLinks(function (link) {
            return color(link.source, 4) || color(link.target, 1) || colors.fallback;
        })
        .nodeWidth(15)
        .nodePadding(20)
        .spread(true)
        .iterations(0)
        .draw(json);

    chart.on("node:mouseover", showValue);
    chart.on("link:mouseover", showValue);
    chart.on("node:mouseout", hideValue);
    chart.on("link:mouseout", hideValue);

    //Hide or show links by clicking on the nodes
    chart.on("node:click", function (d) {

        if (d.column == "3") {

            var links = [],
                nodes = [],
                allNodes = document.getElementsByClassName("node"),
                allLinks = document.getElementsByTagName("path");

            if (currentStructureSankey == "trail1") {

                for (var i = 0; i < allLinks.length; i++) {
                    if (allLinks[i].className.animVal.indexOf('section_') === 5) {
                        links.push(allLinks[i]);
                    }
                }
                for (var i = 0; i < allNodes.length; i++) {
                    if (allNodes[i].id.indexOf('province_') === 0) {
                        nodes.push(allNodes[i]);
                    }
                }
            } 
            else {
                
                for (var i = 0; i < allLinks.length; i++) {
                    if (allLinks[i].className.animVal.indexOf('province_') === 5) {
                        links.push(allLinks[i]);
                    }
                }
                for (var i = 0; i < allNodes.length; i++) {
                    if (allNodes[i].id.indexOf('section_') === 0) {
                        nodes.push(allNodes[i]);
                    }
                } 
            }

            var paths = document.getElementsByClassName("link " + d.id);
            //Showing and hiding links
            for (var i = 0; i < paths.length; i++) {
                paths[i].style.display = (paths[i].style.display === 'block' ? 'none' : 'block');
                
//                d3.select(paths[i]).transition()
//                            .duration(600)
//							.style("stroke-width", function(d) { return Math.max(1,d.dy); })
            }


            //Showing and hiding nodes
            for (var i = 0; i < paths.length; i++) {
                if (document.getElementById(d.sourceLinks[i].target.id).style.display === 'none') {
                    document.getElementById(d.sourceLinks[i].target.id).style.display = 'block';

                } else {

                    for (var j = 0; j < links.length; j++) {
                        if (links[j].style.display === 'block') {
                            document.getElementById(d.sourceLinks[i].target.id).style.display = 'block'
                            break;
                        } else {
                            document.getElementById(d.sourceLinks[i].target.id).style.display = 'none';
                        }
                    }

                }

            }

            //checking the nodes one by one to see if any of them are left without links
            for (var i = 0; i < nodes.length; i++) {

                var count = 0;
                var size = d3.select(nodes[i]).data()[0].targetLinks.length;

                //checking the paths coming into the node
                for (var j = 0; j < size; j++) {
                    var source = d3.select(nodes[i]).data()[0].targetLinks[j].source.id;
                    var target = d3.select(nodes[i]).data()[0].targetLinks[j].target.id;

                    if (document.getElementById(source + " " + target).style.display === 'block') {
                        count++;
                    }
                }

                //if there were no paths going into the node
                if (count == 0) {
                    document.getElementById(target).style.display = 'none';
                }
            }
        }
    });



    function label(node) {
        return node.name.replace(/\s*\(.*?\)$/, '');
    }

    function color(node, depth) {
        var id = node.id.replace(/(_)?(_\w+)?$/, '');
        if (colors[id]) {
            return colors[id];
        } else if (depth > 0 && node.targetLinks && node.targetLinks.length == 1) {
            return color(node.targetLinks[0].source, depth - 1);
        } else {
            return null;
        }
    }

    //Getting the total investments
    var totalFunds = d3.select(document.getElementById("Total")).data()[0].value;

    function showValue(d) {
     
        if (d.source) { //For links
        
        //Finding the portions related to individuals and organizations
        var orgsShare = 0;
        var indivShare = 0;
        var n = currentStructureSankey=="trail1" ? "2" : "3";
        d3.json("/data/treemapdata"+n + currentYear + ".json", function (error, jsonTree) { 
            for (var i=0; i<jsonTree.children.length; i++){
                    if (jsonTree.children[i].fullname == d.source.fullname){
                        var start = jsonTree.children[i];
                        for (var j=0; j< start.children.length; j++){
                            if (start.children[j].fullname == d.target.fullname){
                                var end = start.children[j];
                                for (var k=0; k<end.children.length; k++){
                                    if (end.children[k].fullname=="Organizations"){
                                         orgsShare = end.children[k].size;
                                    }else{
                                         indivShare = end.children[k].size;
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
            }

            //Show values on top of the graph
            var label = d3.select("#show-values");

            label.append("p")
                .attr("id", "value1")
                .text(d.target.fullname + "'s Share of " + d.source.fullname, "$" + d.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

            label.append("p")
                .attr("id", "value2")
                .text("$" + d.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " (" + (d.value / d.source.value * 100).toFixed(2) + "% of " + d.source.fullname + ")");

            label.append("p")
                .attr("id", "value3")
                .text(indivShare == 0 ? "" : "Share of Individuals: $" + indivShare.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            
            label.append("p")
                .attr("id", "value4")
                .text(orgsShare == 0 ? "" : "Share of Organizations: $" + orgsShare.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        });


        } else { //For nodes

            //Show values on top of the graph
            var label = d3.select("#show-values");

            label.append("p")
                .attr("id", "value1")
                .text(d.fullname);

            label.append("p")
                .attr("id", "value2")
                .text("$" + d.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))

            label.append("p")
                .attr("id", "value3")
                .text(d.id == 'Total' ? "" : (d.value / totalFunds * 100).toFixed(2) + "% of Total Investment");

            document.getElementById(d.id + "-text").style.fontWeight = 800;
            document.getElementById(d.id + "-text").style.fontSize = 15;
        }
    }

    function hideValue(d) {

        d3.select("#show-values").selectAll("*").remove();

        if (!d.source) {
            document.getElementById(d.id + "-text").style.fontWeight = 600;
            document.getElementById(d.id + "-text").style.fontSize = 13;
        }
    }
}

//Draw buttons to sort data in Sankey
function drawButtons() {

    // Dimensions of buttons: width, height, spacing, radius of rounded rect.
    var li = {
        w: 80,
        h: 30,
        s: 3,
        r: 3
    };

    var buttonColors = {
        "By Size": '#3399cc',
        "Alphabetically": '#9f9fa3'
    }

    var textColors = ["#fff", "#dcdcdc"]

    var ids = ["button1", "button2"]

    var button = d3.select("#data-order-buttons").append("svg:svg")
        .attr("width", d3.keys(buttonColors).length * (li.w + li.s))
        .attr("height", li.h);

    var g = button.selectAll("g")
        .data(d3.entries(buttonColors))
        .enter().append("svg:g")
        .attr("transform", function (d, i) {
            return "translate(" + i * (li.w + li.s) + ",0)";
        })
        .attr("id", function (d, i) {
            return ids[i]
        })

    g.append("svg:rect")
        .attr("rx", li.r)
        .attr("ry", li.r)
        .attr("width", li.w)
        .attr("height", li.h)
        .style("fill", function (d) {
            return d.value;
        });

    g.append("svg:text")
        .attr("x", li.w / 2)
        .attr("y", li.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .style("font-weight","600")
        .style("fill", function (d, i) {
            return textColors[i];
        })
        .text(function (d) {
            return d.key;
        });
}

// Generate a string that describes the points of a sequence polygon.
function breadcrumbPoints(d, i) {

    // Sequences dimensions: width, height, spacing, width of tip/tail.
    var b = {
        w: 75,
        h: 30,
        s: 3,
        t: 10
    };
    var points = [];
    points.push("0,0");
    points.push(b.w + ",0");
    points.push(b.w + b.t + "," + (b.h / 2));
    points.push(b.w + "," + b.h);
    points.push("0," + b.h);
    if (i > 0) { // Leftmost polygon
        points.push(b.t + "," + (b.h / 2));
    }
    return points.join(" ");
}

//Draw the sequences showing data order
function drawSequences(position, trail, levels) {

    // Sequences dimensions: width, height, spacing, width of tip/tail.
    var b = {
        w: 75,
        h: 30,
        s: 3,
        t: 10
    },
    poly = [{
            "x": 0.0,
            "y": 0
    },
        {
            "x": 0,
            "y": 0
    },
        {
            "x": 0,
            "y": 0
    },
        {
            "x": 0,
            "y": 0
    }];

    var g = d3.select(trail)
        .selectAll("g")
        .data(poly)

    var entering = g.enter().append("svg:g");

    entering.append("svg:polygon")
        .attr("points", breadcrumbPoints)
        .style("fill", function (d, i) {
            return levels[position][i].color;
        });

    entering.append("svg:text")
        .attr("x", (b.w + b.t) / 2)
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .style("font-weight","600")
        .attr("text-anchor", "middle")
        .attr("fill", function (d, i) {
            if (currentGraph == "tree"){
                return levels[position][i].name == "Total" ? 'white' : 'black';
            }else {
                return levels[position][i].name == "Total" ? 'black' : 'white';
            }
        })
        .text(function (d, i) {
            return levels[position][i].name;
        });

    g.attr("transform", function (d, i) {
        return "translate(" + i * (b.w + b.s) + ",0)";
    });
}