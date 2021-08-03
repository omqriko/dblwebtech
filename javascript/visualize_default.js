var fileCheck = new XMLHttpRequest(); //declare here to use in both functions
const svg1 = d3.select('#visual1');
const svg2 = d3.select('#visual2'); // declare variables to access the svg files
const svg3 = d3.select("#visual3");
var ccOn = false;
var linked = false;
//var dataset= document.getElementById("select_button").value;
var inverted = false;

function selectButton(){
    if(document.getElementById("select_button").value=="../datasets/standard.json"){ // if standard dataset is selected
        // same function to check as in upload.js deleteButton()
        fileCheck.open('GET', "../datasets/custom.json", true);
        fileCheck.send();
        check();
    } else { // if custom dataset is selected
        //document.getElementById("select_button").innerHTML = "Use custom dataset";
        document.getElementById("select_button").value = "../datasets/standard.json";
        //document.getElementById("select_text").innerHTML = "The standard dataset is selected.";
        selection=document.getElementById("select_button").value;
        filter_data();
    }
}

function check(){
    if(fileCheck.status=="0"){
        setTimeout(() => check(), 100);
    } else if(fileCheck.status=="200" && fileCheck.responseText != null){ 
        // if the path gives a return value and the return value isn't null
        //document.getElementById("select_button").innerHTML = "Use standard dataset";
        document.getElementById("select_button").value = "../datasets/custom.json";
        //document.getElementById("select_text").innerHTML = "The custom dataset is selected.";
        selection=document.getElementById("select_button").value;
        filter_data(); //redraw graph
    } else { // if no file is found
        //document.getElementById("select_text").innerHTML = `The standard dataset is selected. <br/>
        //                                                    Please upload a custom dataset first.`;
    }
}



// Slider Dates Code
startDate = document.getElementById("myDateStart");
endDate = document.getElementById("myDateEnd");
outputStart = document.getElementById("startDate");
outputEnd = document.getElementById("endDate");
minGap = 0;

outputStart.textContent = startDate.value;
outputEnd.textContent = endDate.value;

function startDateSlider() {
    if (parseInt(endDate.value) - parseInt(startDate.value) <= minGap) {
        startDate.value = parseInt(endDate.value) - minGap;
    }

    filter_data();
}

function endDateSlider() {
    if (parseInt(endDate.value) - parseInt(startDate.value) <= minGap) {
        endDate.value = parseInt(startDate.value) + minGap;
    }
    filter_data();
}



// Slider Levels code
sliderLayer = document.getElementById("myLevel");
outputLayer = document.getElementById("myOutput");

function myLevel() {
    outputLayer.textContent = sliderLayer.value;
    filter_data();
}



// Visualizations Display Buttons
viz1 = document.getElementById("mySunburst");
viz2 = document.getElementById("myCircle");
viz3 = document.getElementById("myNode");
viz1.style.display = "block";
viz2.style.display = "block";
viz3.style.display = "block";

function enableSun() {
    if (viz1.style.display == "none") {
        viz1t.style.display = "block";
    } else {
        viz1t.style.display = "none";
        // console.log("not")
    }
    
}

function enableCir() {
    if (viz2.style.display == "none") {
        viz2.style.display = "block";
    } else {
        viz2.style.display = "none";
    }
}

function enableNod() {
    if (viz3.style.display == "none") {
        viz3.style.display = "block";
    } else {
        viz3.style.display = "none";
    }
}

function ccEmails() {
    ccOn = !ccOn;
    filter_data();
}

function linking() {
    linked = !linked;
    filter_data();
}

function invertHierarchy() {
    inverted = !inverted;
    filter_data();
}

function redraw(real_data) {
    svg1.selectAll("path").remove();
    svg1.selectAll("text").remove();
    svg2.selectAll("circle").remove();
    svg2.selectAll("text").remove();
    svg3.selectAll("circle").remove();
    var selection = document.getElementById("select_button").value;
    visualize1(real_data)
}

function filter_data() {
    d3.json(selection).then(function(real_data){
        var minDate = Date.now();
        var maxDate = 0;
        real_data.forEach(function getDate(d){
        date = new Date(d.date);
         if (date < minDate) minDate = date;
         if (date > maxDate) maxDate = date;
        })
        filtered_data = d3.filter(real_data, d=> (((new Date(d.date)-minDate)*100)/(maxDate-minDate)) <= parseInt(endDate.value) && (((new Date(d.date)-minDate)*100)/(maxDate-minDate)) >= parseInt(startDate.value));
        if (!ccOn) {
            var filtered_data = d3.filter(filtered_data, d=> d.messageType == "TO")
        }
        redraw(filtered_data)
        var endDatex = new Date(parseInt(endDate.value)*(maxDate - minDate)/100 + minDate.getTime())
        var startDatex = new Date(parseInt(startDate.value)*(maxDate - minDate)/100 + minDate.getTime())
        outputEnd.textContent = endDatex.getDay() + "/" + endDatex.getMonth() + "/" + endDatex.getFullYear()
        outputStart.textContent = startDatex.getDay() + "/" + startDatex.getMonth() + "/" + startDatex.getFullYear()
        
    });
}
filter_data();
