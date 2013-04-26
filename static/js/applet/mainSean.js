/* Some global variables. */
var geoApp = "";
var r1 = "";
var pF = "";
var initBool = "false";

/* This function calls init when the window loads.*/
function addLoadEvent(func) {
  var oldonload = window.onload;
  
  if(initBool=="false")
  {
  
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
  initBool = "true";
  
  }
}

// not sure why we need the set timeout here, but it works, so i won't mess with it
//addLoadEvent(setTimeout(init, 1, new Point(0,0), 0));

/* Init initializes the robot and the playing field. Ultimately, this should be configurable.*/
function init(startingLocation, startingOrientation)
{
    console.log("Main: init");
    r1 = new Robot(startingLocation, startingOrientation);
    geoApp = document.ggbApplet;
    console.log("geoApp: " + geoApp);
    pF = new PlayingField();
    r1.show();
    doc.initialize();
}