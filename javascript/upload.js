function tabSelect(pageName, elmnt, color) {
  // Hide all elements with class="tabcontent" by default */
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove the background color of all tablinks/buttons
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }

  // Show the specific tab content
  document.getElementById(pageName).style.display = "block";

  // Add the specific color to the button used to open the tab content
  elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();


// button functions start here
var fileCheck = new XMLHttpRequest(); //declare here to use in all functions
var upload=document.getElementById("uploadForm"); // we use a variable to make the next function more readable

upload.addEventListener("change",function checkForm(){ // if a file is added this will change
    document.getElementById("submit").style.visibility = "visible"; // make it possible to click the submit button
    document.getElementById("message").innerHTML = "Click submit to confirm."; // set the message
})


function deleteButton() {
    // we have a get request for this trajectory. We must set it to true since it can't run it synchronously 
    fileCheck.open('GET', "../datasets/custom.json", true); 
    fileCheck.send() // send the request
    check();
}

function check(){
    console.log(fileCheck.status);
    console.log(fileCheck.Text);
    if(fileCheck.status=="0"){ // if the check is not finished
        setTimeout(() => check(), 100); // wait 100ms and call the function again
    } else if(fileCheck.status=="200" && fileCheck.responseText != null){ 
        // if the path gives a return value and the return value isn't null
        document.getElementById("warning").style.color = "#ff0000"; // set warning to red
        document.getElementById("warning").innerHTML = `WARNING: there is no way to retrieve the dataset once it is deleted. 
					The only way to use the dataset again is by reuploading it with the upload button.<br/>
					Are you sure you want to delete your dataset?`; // change warning message
					
		// make buttons and warning visible
        document.getElementById("warning").style.visibility = "visible";
        document.getElementById("cancel").style.visibility = "visible";
	    document.getElementById("confirm").style.visibility = "visible"; 
    } else { // if no file is found
        document.getElementById("warning").style.color = "#000000"; // warning is black
        document.getElementById("warning").innerHTML = "No custom file is uploaded."; // warning text is changed
        document.getElementById("warning").style.visibility = "visible"; // text is visible
    }
}

function cancelButton() {
    // if it is canceled hide the buttons again
    document.getElementById("cancel").style.visibility = "hidden";
	document.getElementById("confirm").style.visibility = "hidden";
	document.getElementById("warning").style.visibility = "hidden";
}

function submitButton() {
    // give a message to submit the file which displays until the page is reloaded
    document.getElementById("message").innerHTML = "File submitted, please wait for the page to refresh."
}
