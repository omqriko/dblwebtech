// Slideshow Sunburst
var sunburstIndex = 1;
showSunburst(sunburstIndex);

function addSunburst(n) {
    showSunburst(sunburstIndex += n);
}

function setSunburst(n) {
    showSunburst(sunburstIndex = n);
}

function showSunburst(n) {
    var i1;
    var sunburst = document.getElementsByClassName("mySunbursts");
    var dotsSunburst = document.getElementsByClassName("dotSunburst");
    
    if (n > sunburst.length) {sunburstIndex = 1}
    if (n < 1) {sunburstIndex = sunburst.length}
    
    for (i1 = 0; i1 < sunburst.length; i1++) {
        sunburst[i1].style.display = "none";  
    }
      
    for (i1 = 0; i1 < dotsSunburst.length; i1++) {
        dotsSunburst[i1].className = dotsSunburst[i1].className.replace(" active", "");
    }
    
    sunburst[sunburstIndex-1].style.display = "block";  
    dotsSunburst[sunburstIndex-1].className += " active";
}



// Slideshow Circle
var circlesIndex = 1;
showCircles(circlesIndex);

function addCircles(n) {
    showCircles(circlesIndex += n);
}

function setCircles(n) {
    showCircles(circlesIndex = n);
}

function showCircles(n) {
    var i2;
    var circles = document.getElementsByClassName("myCircles");
    var dotsCircles = document.getElementsByClassName("dotCircles");
    
    if (n > circles.length) {circlesIndex = 1}
    if (n < 1) {circlesIndex = circles.length}
    
    for (i2 = 0; i2 < circles.length; i2++) {
        circles[i2].style.display = "none";  
    }
      
    for (i2 = 0; i2 < dotsCircles.length; i2++) {
        dotsCircles[i2].className = dotsCircles[i2].className.replace(" active", "");
    }
    
    circles[circlesIndex-1].style.display = "block";  
    dotsCircles[circlesIndex-1].className += " active";
}



// Slideshow Node
var nodeIndex = 1;
showNodes(nodeIndex);

function addNodes(n) {
    showNodes(nodeIndex += n);
}

function setNodes(n) {
    showNodes(nodeIndex = n);
}

function showNodes(n) {
    var i3;
    var nodes = document.getElementsByClassName("myNodes");
    var dotsNodes = document.getElementsByClassName("dotNodes");
    
    if (n > nodes.length) {nodeIndex = 1}
    if (n < 1) {nodeIndex = nodes.length}
    
    for (i3 = 0; i3 < nodes.length; i3++) {
        nodes[i3].style.display = "none";  
    }
      
    for (i3 = 0; i3 < dotsNodes.length; i3++) {
        dotsNodes[i3].className = dotsNodes[i3].className.replace(" active", "");
    }
    
    nodes[nodeIndex-1].style.display = "block";  
    dotsNodes[nodeIndex-1].className += " active";
}