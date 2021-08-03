function visualize1(real_data){ // we make it a function so we can call it from the visualize_default file

 
// selection contains the value of select_button which is a datapath

// d3.json(selection).then(function(real_data){
var background = "#fff"
var data = real_data
var grouped_data;
const svg1 = d3.select('#visual1');
var partitioned_data;
var root_node;
var color;
var height = svg1.attr("height");
var width = svg1.attr("width");
var sun_root;
var circle_root;
var num_sun = 1;
var num_circ = 1;

format_data();
draw();
//main code
function draw() {
    color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, root_node.children.length + 1));
    makePartition();
    drawSubtree(root_node,width/4,height/2);
}



//format data in correct data struct
function format_data() {
    if (!inverted) {
        grouped_data = d3.group(data, d => d.fromJobtitle, d => d.toJobtitle, d=> d.fromEmail, d=> d.toEmail);
    } else {
        grouped_data = d3.group(data, d => d.toJobtitle, d => d.fromJobtitle, d=> d.toEmail, d=> d.fromEmail);
    }
    root_node = d3.hierarchy(grouped_data).count();
}

function makePartition() {
  partitioned_data = d3.partition().size([2*Math.PI, height/2]);
  partitioned_data(root_node);
  root_node.sort((a,b) => a.count()-b.count());
  root_node.each(d => giveNumSun(d))
  sun_root = root_node
}

function giveNumSun(d) {
    d.number = num_sun;
    num_sun = num_sun + 1;
}

function clearBoard() {
  svg1.selectAll("path")
    .remove();
}

//draws a subtree rooted at node
function drawSubtree(node,x,y) {
  if (node.depth <= sliderLayer.value){
    drawNode(node,x,y);
  }
  if (node.children != undefined) {
    for (var i = 0; i < node.children.length ;i++) {
      drawSubtree(node.children[i],x,y);
    }
  }
}

function drawNode(node,x,y) {
    node.sentiment = 0;
  if (node.height == 1) {
    for (var i = 0; i < node.children.length; i++) {
        if (!isNaN(node.children[i].data.sentiment)) {
            node.sentiment = parseFloat(node.children[i].data.sentiment) + node.sentiment;
        }
    }
    node.sentiment = node.sentiment/node.children.length;
    node.y1 = node.y1 + ((node.y1 - node.y0)*3*node.sentiment)
  }
  var arc = d3.arc()
    .startAngle(node.x0)
    .endAngle(node.x1)
    .innerRadius(node.y0)
    .outerRadius(node.y1)

  var path = svg1.append("path")
    .attr("d", arc)
    .attr("transform", "translate("+ x + "," + y + ")")
    .style('stroke','#fff')
    .attr("fill",calculateColor(node))
    .style("cursor", "pointer")
    // .attr("opacity",getOpacity(node))
    .datum(node)
    .on("click",function() {
      clicked(node,x,y)
    })
    .on("mouseover",function() {
      mouseOver(path)
    })
    .on("mouseout",function () {
        mouseOut(path)
    })
    // .on("click",click)
  node.current ={ 
  "x0" : node.x0,
  "x1" : node.x1,
  "y0" : node.y0,
  "y1" : node.y1};


}


function calculateColor(node) {
  if (node == root_node) {
    return background;
  } 

  while (node.depth > 1) {
    node = node.parent;
  }
  return color(node.data[0])
}

function clicked(node) {
  root_node.each(d => d.target = {
    x0: Math.max(0, Math.min(1, (d.x0 - node.x0) / (node.x1 - node.x0))) * 2 * Math.PI,
    x1: Math.max(0, Math.min(1, (d.x1 - node.x0) / (node.x1 - node.x0))) * 2 * Math.PI,
    y0: Math.max(0, d.y0 - node.depth),
    y1: Math.max(0, d.y1 - node.depth)
  });
  var paths = svg1.selectAll("path")
  var t = svg1.transition().duration(500)
  var arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1);

  paths.transition(t)
        .tween("data", d => {
          const i = d3.interpolate(d.current, d.target);
          return t => d.current = i(t);
        })
        .attrTween("d", d => () => arc(d.current));
//   root.each(d => findCircleNode(d,node))
    sun_root = node;
    if (linked){
        root.each(d => findCircleNode(d,node))
        if (node.depth == 1) {
            zoomNode(node.data[0])
        } else if (node.depth == 0) {
            zoomClear()
        }
    }
}

function findCircleNode(d,node) {
    if (node.number == d.number) {
        if (circle_root.number != d.number) {
            zoom(d)
        }
    }
}

function findSunNode(d,node) {
    if (node.number == d.number) {
        if (sun_root.number != d.number) {
            clicked(d)
        }
    }
}

function mouseOut (path) {
  path = path.attr("opacity",1)
  svg1.selectAll("text").remove()
}

function mouseOver(path) {
  path = path.attr("opacity",0.75)
  text = svg1.append("text")
  .attr("x", 5)
  .attr("y", 16)
  .style("fill", "#000000")
  .text(getText(path.data()[0]))
  .attr("text-anchor", "left")
  .style("alignment-baseline", "middle")
}

function getText(node) {
  !inverted ? sym = " > " : sym = " < ";
  if (node.depth == 1) {
    return  node.data[0] + " (" + node.value + ")";
  } else if(node.depth == 2) {
    return node.parent.data[0] + sym + node.data[0] + " (" + node.value + ")";
  } else if(node.depth == 0){
    return "Total Emails" + " (" + node.value + ")";
  } else if(node.depth == 3){
    return node.parent.parent.data[0] + sym + node.parent.data[0] +  " > " + node.data[0] + " (" + node.value + ")";
  } else if (node.depth == 4){
    return node.parent.parent.parent.data[0] + sym + node.parent.parent.data[0] + " > " + node.parent.data[0] +  sym + node.data[0] + " (" + node.value + ")"
  }
}
    var dataset = real_data
    if (!inverted) {
        map = d3.group(data, d => d.fromJobtitle, d => d.toJobtitle, d=> d.fromEmail, d=> d.toEmail);
    } else {
        map = d3.group(data, d => d.toJobtitle, d => d.fromJobtitle, d=> d.toEmail, d=> d.fromEmail);
    }
    root = d3.hierarchy(map)
  .count()
  .sort(function(a, b) {return 50});

var minSentiment = 0,
    maxSentiment = 0;
    
 root.each(function getSentiment(d){
    if (d.height == 1) {
    d.avgSentiment = 0;
    d.children.forEach(function getAvgSentiment(child) {
      d.avgSentiment += parseFloat(child.data.sentiment);
    })
    d.avgSentiment /= d.children.length;
    d.avgSentiment > maxSentiment ? maxSentiment = d.avgSentiment : null;
    d.avgSentiment < minSentiment ? minSentiment = d.avgSentiment : null;
  }
  })
  root.each(d => removeThing(d))

    function removeThing(d) {
        if (d.depth >= sliderLayer.value) {
            d.children = undefined;
        }
    d.number = num_circ;
    num_circ = num_circ + 1;
    }


var circleColor = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

var negativeNodeColor = d3.scaleLinear()
    .domain([minSentiment, 0])
    .range(["hsl(271,100%,14%)", "hsl(278,100%,83%)"])
    .interpolate(d3.interpolateHcl);

var positiveNodeColor = d3.scaleLinear()
    .domain([0, maxSentiment])
    .range(["hsl(60,100%,90%)", "hsl(60,100%,50%)"])
    .interpolate(d3.interpolateHcl);

var svg2 = d3.select("#visual2").on("click", function(event) {zoom(root);}),
  margin = 20,
  diameter = +svg2.attr("width"),
  g = svg2.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

var focus = root,
    nodes = pack(root).descendants(),
    view;
    circle_root = root;



var circle = g.selectAll("circle")
  .data(nodes)
  .enter().append("circle")
  .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
  .style("fill", function(d) { 
        if (d.children) return circleColor(d.depth);
        else if (d.avgSentiment < 0) return negativeNodeColor(d.avgSentiment);
        else if (d.avgSentiment > 0) return positiveNodeColor(d.avgSentiment);
        else return null;      
      })
  .on("click", function(event,d) { if (focus !== d) {zoom(d), event.stopPropagation();} else zoom(root); })
  .on("mouseover", function(circle) {
    // let text,sym;
    let d = circle.srcElement.__data__;
    // !inverted ? sym = " > " : sym = " < ";
    // switch(d.height) {
    //   case 4:
    //     text = d.data[0] + " ( " + + " ) ";
    //     text2.text(text)
    //     break;

    //   case 3:
    //     text = d.parent.data[0] + sym + d.data[0];
    //     text2.text(text)
    //     break;

    //   case 2:
    //     text = d.parent.parent.data[0] + sym + d.parent.data[0] + " > " + d.data[0];
    //     text2.text(text)
    //     break;

    //   case 1:
    //     text = d.parent.parent.parent.data[0] + sym + d.parent.parent.data[0] + " > " + d.parent.data[0] + sym + d.data[0];
    //     text2.text(text)
    //     break;

    //   default:
    //     text = null;
    //     text2.text(text)
    // }
    text2.text(getText(d));
  })
  .on("mouseout", function(d) {
    text2.text("\n")
  });      

var node = svg2.selectAll("circle");
var text2 = svg2.append("text")
    .attr("x", 6)
    .attr("y", 15)

zoomTo([root.x, root.y, root.r * 2 + margin]);

function zoom(d) {
    
  focus = d;

  var transition = d3.transition()
      .duration(500)
      .tween("zoom", function(d) {
        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
        return function(t) { zoomTo(i(t)); };
      });

//   root_node.each(a => findSunNode(a,d))
    circle_root = d;
    if (linked) {
        root_node.each(a => findSunNode(a,d))
        if (d.depth == 1) {
            zoomNode(d.data[0])
        } else if (d.depth == 0) {
            zoomClear()
        }
    }
}

function zoomTo(v) {
  var k = diameter / v[2]; view = v;
  node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
  circle.attr("r", function(d) { return d.r * k; });
}
// console.log(root_node)
// console.log(root)

var svg3 = d3.select("#visual3"),
  width3 = svg3.attr("width"),
  height3 = svg3.attr("height"),
  color3 = d3.scaleOrdinal(d3.schemeTableau10),
  radius3 = 6,
  maxCount = 0,
  dragging = 0,
  fData = [],
  links = [],
  filteredLinks = [],
  nodeData = real_data;


// Push every id instance in fData.  
nodeData.forEach(function (d){
  fData.push({"id": d.fromId,
              "JobTitle": d.fromJobtitle,
              "email": d.fromEmail})
  fData.push({"id": d.toId,
              "JobTitle": d.toJobtitle,
              "email": d.toEmail})
})


const ids = fData.map(o => o.id)
var nodes3 = fData.filter(({id}, index) => !ids.includes(id, index + 1))


//Create the links array
nodeData.forEach(function (d){
    links.push({"source": d.fromId,
                "target": d.toId,
                "sentiment": d.sentiment,
                "date": d.date})
})

// console.log(links)

//Used to group the nodes on svg canvas.
// var x = d3.scaleOrdinal()
//   .domain(['Trader', 'Employee', 'Unknown', 'Manager', 'Vice President', 'CEO', 'Director', 'President', 'Managing Director', 'In House Lawyer'])
//   .range([50, 150, 250, 350, 450, 550, 650, 750, 850, 950])

// var y = d3.scaleOrdinal()
//   .domain(['Trader', 'Employee', 'Unknown', 'Manager', 'Vice President', 'CEO', 'Director', 'President', 'Managing Director', 'In House Lawyer'])
//   .range([375])


var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().strength(0).id(function(d) { return d.id; }))
  .force("x", d3.forceX())
  .force("y", d3.forceY())
  .force("charge", d3.forceManyBody()) // Nodes are attracted to each other
  .force("collide", d3.forceCollide().strength(0.1).radius(32).iterations(1)) // Force that avoids circle overlapping
  .force("center", d3.forceCenter().strength(0.1).x(width3 / 2).y(height3 / 2)) // Attraction to the center of the svg area
  //.force("charge", d3.forceManyBody().strength(1))
  //.force("collide", d3.forceCollide().strength(.1).radius(32).iterations(10))
  //.force("x", d3.forceX().strength(0.5).x( function(d){ return x(d.JobTitle) } ))
  //.force("y", d3.forceY().strength(0.1).x( function(d){ return x(d.JobTitle) } )) 


//Display the nodes
var node3 = svg3.append("g")
  .attr("class", "nodes3")
  .selectAll("circle")
  .data(nodes3)
  .datum(nodes3)
  .enter().append("circle")
  .attr("r", 5)
  .attr("id", function(d){ return d.id;})
  .attr("fill", function(d) { return color3(d.JobTitle); })
  .style("cursor", "pointer")
  .attr("name", function(d){ return d.JobTitle;})
  .call(drag(simulation));

svg3.on("contextmenu", function(event){ return event.preventDefault();})

node3.on("contextmenu", function(event){ return event.preventDefault();})
  .on("mousedown", function (){
      if(dragging === 0){

        simulation.force("link")
        .links(links);
        //Find the links corresponding to the selected node
        filteredLinks = links.filter(x => ((x.source.id == this.id && !inverted) || (x.target.id == this.id && inverted)) )


        var highlightedNodes = [];

        filteredLinks.forEach(function(d){
          highlightedNodes.push(d.source)
          highlightedNodes.push(d.target)
        })
        //console.log(highlightedNodes)

        let nodes32 = [];
              
        // Declare an empty object
        let uniqueObject2 = {};
              
        // Loop for the array elements
        for (let i in highlightedNodes) {
      
          // Extract the title
          objTitle = highlightedNodes[i]['id'];
      
          // Use the title as the index
          uniqueObject2[objTitle] = highlightedNodes[i];
        }
              
        // Loop to push unique object into array
        for (i in uniqueObject2) {
          nodes32.push(uniqueObject2[i]);
        }

        let source = {};
        for(i in nodes32){
          if(nodes32[i].id == this.id)
            source = nodes32[i]
        }

        let relation = [];

        for(let i in nodes32){
            // console.log(source);
          if(nodes32[i].id != Number(this.id)){
             relation.push({"source": source ,
                           "target": nodes32[i],
                           "exc": 0,
                           "avg_sent": 0})
          }
        }

        for(let i in relation){

          for(let j in filteredLinks)
            if((relation[i].target.id === filteredLinks[j].source.id) ||  (relation[i].target.id === filteredLinks[j].target.id) ){
              relation[i].exc = relation[i].exc + 1;
              relation[i].avg_sent = relation[i].avg_sent + filteredLinks[j].sentiment;
            }

        }
        //console.log(relation)

        for(let i in relation){
          relation[i].avg_sent = relation[i].avg_sent/relation[i].exc;
          relation[i].exc > maxCount ? maxCount = relation[i].exc : null;
        }

        // console.log(relation)

        node3.attr('opacity', function(d){
          if(!filteredLinks.some(code => (code.source.id === d.id || code.target.id === d.id)))
            return 0.5;
        });

        var run2pixels = d3.scaleLinear()
          .domain([0, maxCount]) //unit: count
          .range([2, 5]) // unit: pixels

        //Display the links
        var link = svg3.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(relation)
          .enter().append("line")
          .style("stroke-width", function (d){ return run2pixels(d.exc);})
          .style("stroke", function (d){
            if(d.avg_sent > 0)
            return "#00D100";

            if(d.avg_sent < 0)
            return "#FF0000";
            
            return "#454545";
          });

    

        link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
        
        svg3.selectAll(".links")
           .lower();

    if (linked) {
        job = this.getAttribute("name") // add email here
        // console.log(job)
        root_node.each(d => findSun(d,job))
        function findSun(d,email) {
            if (d.depth == 1) {
                if (d.data[0].toString() == email) {
                    clicked(d)
                }
            }
        }
        root.each(d => findCirc(d,job))
        function findCirc(d,email) {
            if (d.depth == 1) {
                if (d.data[0].toString() == email) {
                    zoom(d)
                }
            }
        }
    }
      }
    
    
  })
  .on("mouseout", function (d){
      if(!linked){
    node3.attr('opacity', 1)
      }
      svg3.selectAll(".links")
      .remove();
  })
  .on("mouseup", function (d){
      if(!linked){
    node3.attr('opacity', 1)
      }
    svg3.selectAll(".links")
      .remove();
}) 


node3.append('title')
    .text(function (d){
      return d.JobTitle + ' ID:'+ d.id + '\n' + d.email;
    });
      
simulation
  .nodes(nodes3)
  .on("tick", ticked);

    

function ticked() {
  //Provide position for nodes and also create bounds.
  node3
    .attr("cx", function(d) { return d.x = Math.max(radius3, Math.min(width3 - radius3, d.x)); })
    .attr("cy", function(d) { return d.y = Math.max(radius3, Math.min(height3 - radius3, d.y)); });
    
}



function drag(simulation){
  
  function dragstarted(event) {
    dragging = 1
    node3.attr('opacity', 1)
    if (!event.active) simulation.alphaTarget(0.1).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
    svg3.selectAll(".links")
                  .remove();
  }
  
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
    svg3.selectAll(".links")
                  .remove();
  }
  
  function dragended(event) {
    dragging = 0
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
    svg3.selectAll(".links")
                  .remove();
  }

  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}
    function zoomNode(email) {
        node3.attr("opacity", function(d){
            if(d.JobTitle !== email)
            return 0.5;
        });
    }
    function zoomClear() {
        node3.attr("opacity", 1);
    }
}

var selection = document.getElementById("select_button").value;

