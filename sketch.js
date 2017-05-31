//globals
var numSteps = 16;
var counter = 0;
var interval;
var timer;
var bmp;
var beatInterval;
var startStop;

var rowsArray = [] // array of Row Objects

// 	Row Settings
var rowX = 400; // top left corner of first row
var rowY = 200;
var stepSize = 60; // size of rect of each step [hard coded]
var xSpacing = 65; // x spacing between nodes [hard coded]
var ySpacing = 65; //
    
//sound file
var soundArray = [];

//color variables --> add this
var inactive;
var active;
var playing

//gui
var gui;


//-------------------------------
function setup() { 
  createCanvas(windowWidth, windowHeight);
  timer = createP('timer');
  noStroke();

  //set bpm and calc interval
  bpm = 200;
  beatInterval = (60000 / bpm);
  
  startStop = new startStopButton(400, 130);

  //load sound file 
  soundArray[0] = loadSound('assets/808-Kicks02.wav');
  soundArray[1] = loadSound('assets/808-HiHats03.wav');
  soundArray[2] = loadSound('assets/808-Clap02.wav');
  soundArray[3] = loadSound('assets/808-Clave1.wav');
  soundArray[4] = loadSound('assets/808-Stick2.wav');
  soundArray[5] = loadSound('assets/HBA1-1-bass01.wav');
  soundArray[6] = loadSound('assets/808-Conga4.wav');
  soundArray[7] = loadSound('assets/808-Conga3.wav');
  soundArray[8] = loadSound('assets/Sci-Fi-Hit.wav');
  soundArray[9] = loadSound('assets/Pedal-Bass-Hit.wav');
  soundArray[10] = loadSound('assets/Ramen-Pedal.wav');

  for(var q = 0; q < soundArray.length; q++) {
  	//push num rows to the rows array
    rowsArray.push(new Row(rowX, rowY + (ySpacing*q), soundArray[q]))
    rowsArray[q].createSteps();
  }
  
  // creates a dom element and sets interval = to 1000
  createTimer(timer, beatInterval); //sets the speed permanently 
  
} 


//------------------------------
function draw() { 
  background(220);
  
  
  for(var d = 0; d < rowsArray.length; d++){
  	//call displaySteps Method for each row in rows Array
    rowsArray[d].displaySteps();
    rowsArray[d].playSounds();
    }
 if (startStop.isOver == true) {
    fill(0, 255, 0);
    
 } else {
   fill(50);
 }
   startStop.display();
}

//------------------------------
function mousePressed() {
  //set the step prop as active if the mouse is pressed over its position
  

  for (var p = 0; p < rowsArray.length; p++) {
  		//each row in rows array
    	rowsArray[p].stepWasClicked();
    
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
function Step(x, y, s) {
	//constructor
  this.x = x;
  this.y = y;
  this.size = stepSize;
  this.sound = s; 
  this.active = false;
  this.alreadyPlaying = false;
  
  //draws rect at passed xy pos
  this.display = function() {
  rect(this.x, this.y, this.size, this.size);
  
}
  this.play = function() {
    this.sound.play();
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
function Row(x, y, sample) {
	
	this.steps = [];
  this.x = x;
  this.y = y;
	this.xSpacing = xSpacing;
  this.sample = sample;
  
  this.createSteps = function() {
  	//push step objects to the step array
    
  	for(var j = 0; j < numSteps; j++) {
    	this.steps.push(new Step(this.x+j*xSpacing, this.y, this.sample));
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
        	fill(104, 255, 188); // current counter pos but active / fill red
        }
        
      } else if (this.steps[i].active == true) {
      	fill(0, 200, 0); // not current counter pos & not active / fill red
      }
      
      else {
        
        fill(200);
      }
      // call steps display method after fill has been set
  		this.steps[i].display();
      this.steps[i].isOver();
  	}
  }

  this.playSounds = function() {
    //checks the current counter position and plays the sound
    for(var t = 0; t < this.steps.length; t++) {
      //each step in steps array
      if (t == counter && this.steps[t].active && this.steps[t].alreadyPlaying == false) {
          this.steps[t].active = true; //turns node off again
          this.steps[t].alreadyPlaying = true;
          this.steps[t].sound.play(); //what for step play function
          //console.log('sound play!');
        
      }  
      
      //turns the next step on [alreadyplaying = false] if its active [red]
      if (t == counter + 1 && this.steps[t].active) {
        if (this.steps[t].alreadyPlaying == true) {
          //console.log('making red step alreadyPlaying = false');
          this.steps[t].alreadyPlaying = false;
        }
      }

      if (t == counter - 1 && this.steps[t].active) {
        if (this.steps[t].alreadyPlaying == true) {
          //console.log('making red step alreadyPlaying = false');
          this.steps[t].alreadyPlaying = false;
        }
      }
    }
  }
}

//------------------------------
function startStopButton (x, y) {
  this.x = x;
  this.y = y;
  this.xSize = 125;
  this.ySize = 65;

  this.isOver = function() {
    if ((mouseX > this.x) && (mouseX < this.x + this.xSize)) {
      if ((mouseY > This.y) && (mouseY < this.y + this.ySize)) {
        return true;
      } 
    }

  }

  this.display = function() {
    fill(50);
    rect(this.x, this.y, this.xSize, this.ySize);
    fill(255);
    textSize(14);
    text('Start / Stop', this.x+25, this.y+40);
  }
 
}




//TO DO

//add mouse click start stop
//fix bottom 4 more tracks
//host online