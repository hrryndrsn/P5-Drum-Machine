var numSteps = 16;
var counter = 0;
var interval;
var timer;

var numRows = 8;
var rowsArray = [] // array of Row Objects

// 	Row Settings
var rowX = 100; // top left corner of first row
var rowY = 100;
var stepSize = 30; // size of rect of each step [hard coded]
var xSpacing = 35; // x spacing between nodes [hard coded]
var ySpacing = 35; //
    
//sound file
var kick;



//-------------------------------
function setup() { 
  createCanvas(800, 800);
  timer = createP('timer');
  noStroke();

  //load sound file 
  kick = loadSound('assets/808-Kicks02.wav')
  
  for(var q = 0; q < numRows; q++) {
  	//push num rows to the rows array
    rowsArray.push(new Row(rowX, rowY + (ySpacing*q)))
    rowsArray[q].createSteps();
  }
  
  // creates a dom element and sets interval = to 1000
  createTimer(timer, 500);
  
} 


//------------------------------
function draw() { 
  background(220);
  
  
  for(var d = 0; d < rowsArray.length; d++){
  	//call displaySteps Method for each row in rows Array
    rowsArray[d].displaySteps();
    rowsArray[d].playSounds();
  }
  
}

//------------------------------
function mousePressed() {
  //set the step prop as active if the mouse is pressed over its position
  

  for (var p = 0; p < rowsArray.length; p++) {
  		//each row in rows array
    	rowsArray[p].stepWasClicked();
    
    	for (var v = 0; v < rowsArray[p].steps.length; v++) {
 					//accessing all steps 
        	
      }
  }
  
		
}
  

//------------------------------
function createTimer(element, wait) {
	
  setInterval (timeIt, wait);
  
  //function to call every interval of wait
  function timeIt() {
  	element.html(counter);
  	
    if (counter > 14) {
      counter = 0;
    } else {
    	counter++
    }
  }
}


//------------------------------
function Step(x, y) {
	//constructor
  this.x = x;
  this.y = y;
  this.size = stepSize;
  this.sound = kick;
  this.active = false;
  this.alreadyPlaying = false;
  
  //draws rect at passed xy pos
  this.display = function() {
  rect(this.x, this.y, this.size, this.size);
  
  }
  
  
  //tests is the mouse position is over this step
  this.isOver = function() {
  	//switches active bool
    
    if (mouseX > this.x && mouseX < (this.x + this.size)) {
  			//if the mouse x pos is between this.x and this.x + size
      if (mouseY > this.y && mouseY < (this.y + this.size)) {
      	//if the mouse y pos is between this.y and this.y + size
      	//this.active = true; // remove me 
        return true; 
      } else {     
      	//this.active = false;
        return false;
      }      
    } else {
    	//this.active = false;
      return false;
    }
  }
}

//------------------------------
function Row(x, y) {
	
	this.steps = [];
  this.x = x;
  this.y = y;
	this.xSpacing = xSpacing;
  
  this.createSteps = function() {
  	//push step objects to the step array
    
  	for(var j = 0; j < numSteps; j++) {
    	this.steps.push(new Step(this.x+j*xSpacing, this.y));
  	}
  }
  
  this.stepWasClicked = function () {
  		for (var g = 0; g < this.steps.length; g++) {
      		var mouseOver = this.steps[g].isOver();
        	if (mouseOver == true && this.steps[g].active == false) {
          	this.steps[g].active = true;
          } else if (mouseOver == true && this.steps[g].active == true) {
          		this.steps[g].active = false;	
          }
      }
  
  }
  
  this.displaySteps = function() {
   // set fill and call Step.display method for each step in steps array
    for(var i = 0; i < this.steps.length; i++) {
  	
    //check current counter position 
      if (i == counter) {
        if (this.steps[i].active == false) {
        	fill(0, 0, 225); // current counter pos but not active/ fill blue
        } else {
        	fill(255, 0, 0); // current counter pos but active / fill red
        }
        
      } else if (this.steps[i].active == true) {
      	fill(255, 0 , 0); // not current counter pos & not active / fill black
      }
      
      else {
        
        fill(0);
      }
      // call steps display method after fill has been set
  		this.steps[i].display();
      this.steps[i].isOver();
  	}
  }

  this.playSounds = function() {
    //checks the current counter position and plays the sound
    //seperate the sound from the visuals but basically do the same check

    for(var t = 0; t < this.steps.length; t++) {
      //check counter position
      if (t == counter) {
        //if the current element is equal to the counter position
        if (this.steps[t].active == true) {
          if (kick.isPlaying() == false) {
            kick.play();
          }
          
        }
      }

    }

  }
}