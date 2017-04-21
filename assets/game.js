/**
 * game.js
 * JAVASCRIPT TETRIS
 *
 * January 2014 - Richard Klose / Maximilian Frercksen
 */
$(document).ready(function(){
	var points = 0;
	var gameover = false;
	var currX = 0;
	var currY = 0;
	var canvas = document.getElementById('gamecanvas');
	var canvas2 = document.getElementById('nextcanvas');
	var ctx = canvas.getContext("2d");
	var ctx2 = canvas2.getContext("2d");
	var delay = 1000;
	var finish = false;
	var drop = false;
	var placedBoxes = new Array(24);
	for (var i = 0; i < placedBoxes.length; i++) {
		placedBoxes[i] = new Array(16);
	}
	var nextObject;
	var nextObj;
	var boxesInLine = new Array(24);
	
	var logLevel = -1; // -1 = off,0 = minimal,1 = medium,2 = more,3 = everything
	
	function log0(string){
		if(logLevel!=-1);
		console.log("[GAME] "+string);
	}

	function log1(string){
		if(logLevel==1||logLevel==2||logLevel==3){
			console.log("[GAME] "+string);
		}
	}

	function log2(string){
		if(logLevel==2||logLevel==3){
			console.log("[GAME] "+string);
		}
	}
	function log3(string){
		if(logLevel==3){
			console.log("[GAME] "+string);
		}
	}

	function getRandomInt (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}


	
	// MODELS - GAME OBJECTS

	//simplebox object, to create the tiles from
	function simplebox(){
			this.xPos = 0;
			this.yPos = 0;
			this.print = print;
			function print(color){
				ctx.beginPath();
				ctx.rect(this.xPos*20,this.yPos*20,20,20);
				ctx.fillStyle=color;
				ctx.fill();
				ctx.closePath();
				ctx.strokeStyle = "black";
				ctx.stroke();
				
			}
			this.printPreview = printPreview;
			function printPreview(x,y){
				ctx2.beginPath();
				ctx2.rect(x*20,y*20,20,20);
				ctx2.fillStyle="#AAA";
				ctx2.fill();
				ctx2.closePath();
				ctx2.strokeStyle = "black";
				ctx2.stroke();
			}
			this.move = move;
			function move(xPos,yPos){
				this.xPos += xPos;
				this.yPos += yPos;
			}
			this.init = init;
			function init(xPos,yPos){
				this.xPos = xPos;
				this.yPos = yPos;
			}
	};
	
	//basic tile, only a protoype for the the tiles
	var gameObject = function(){
		this.part1 = new simplebox();
		this.part2 = new simplebox();
		this.part3 = new simplebox();
		this.part4 = new simplebox();
		this.xPos = 0;
		this.yPos = 0;
	};

	gameObject.prototype = {
			print:function(color){
				this.part1.print(color);
				this.part2.print(color);
				this.part3.print(color);
				this.part4.print(color);
			},
			move:function(xPos,yPos){
				this.xPos+=xPos;
				this.yPos+=yPos;
				this.part1.move(xPos,yPos);
				this.part2.move(xPos,yPos);
				this.part3.move(xPos,yPos);
				this.part4.move(xPos,yPos);
				this.print("#AAA");
			},
			rotate:function(){
				// save current position
				helpX = this.xPos;
				helpY = this.yPos;
				//move to 0,0
				this.move(-(this.xPos),-(this.yPos));
				//rotate 90 degree
				this.part1.init(-(this.part1.yPos),this.part1.xPos); //
				this.part2.init(-(this.part2.yPos),this.part2.xPos); //
				this.part3.init(-(this.part3.yPos),this.part3.xPos); // maybe we can move this into simplebox()
				this.part4.init(-(this.part4.yPos),this.part4.xPos); //
				//move back to old position
				this.move(helpX,helpY);
				//check if a box is outside
				
				//clear screen and reprint
				ctx.clearRect(0,0, canvas.width, canvas.height);
				for(var i=0;i<24;i++){
					for(var j=0;j<16;j++){
						if(placedBoxes[i]!=undefined){
							if(placedBoxes[i][j]!=undefined){
								placedBoxes[i][j].print("#777");
							}
						}
					}
				}
				checkIfOutside();
				this.print("#AAA");
				log1("rotated");
		
			},
	};
	

	// O
	var tileO = function(){};
	tileO.prototype = new gameObject();
	tileO.prototype.init = function(xPos){
		this.xPos+=xPos;
		this.yPos+=0;
		this.part1.init(xPos,0);
		this.part2.init(xPos-1,0);
		this.part3.init(xPos,-1);
		this.part4.init(xPos-1,-1);
		this.print("#AAA");
	}
	tileO.prototype.printPreview = function(){
		ctx2.clearRect(0,0, canvas.width, canvas.height);
		this.part1.printPreview(2,2);
		this.part2.printPreview(2,3);
		this.part3.printPreview(3,3);
		this.part4.printPreview(3,2);
	}
	
	// I
	var tileI = function(){};
	tileI.prototype = new gameObject();
	tileI.prototype.init = function(xPos){
		this.xPos+=xPos;
		this.yPos+=0;
		this.part1.init(xPos,+1);
		this.part2.init(xPos,0);
		this.part3.init(xPos,-1);
		this.part4.init(xPos,-2);
		this.print("#AAA");
	}
	tileI.prototype.printPreview = function(){
		ctx2.clearRect(0,0, canvas.width, canvas.height);
		this.part1.printPreview(3,1);
		this.part2.printPreview(3,2);
		this.part3.printPreview(3,3);
		this.part4.printPreview(3,4);
	}

	// Z
	var tileZ = function(){};
	tileZ.prototype = new gameObject();
	tileZ.prototype.init = function(xPos){
		this.xPos+=xPos;
		this.yPos+=0;
		this.part1.init(xPos,0);
		this.part2.init(xPos-1,0);
		this.part3.init(xPos-1,-1);
		this.part4.init(xPos-2,-1);
		this.print("#AAA");
	}
	tileZ.prototype.printPreview = function(){
		ctx2.clearRect(0,0, canvas.width, canvas.height);
		this.part1.printPreview(1,2);
		this.part2.printPreview(2,2);
		this.part3.printPreview(2,3);
		this.part4.printPreview(3,3);
	}

	// S
	var tileS = function(){};
	tileS.prototype = new gameObject();
	tileS.prototype.init = function(xPos){
		this.xPos+=xPos;
		this.yPos+=0;
		this.part1.init(xPos,-1);
		this.part2.init(xPos-1,-1);
		this.part3.init(xPos-1,0);
		this.part4.init(xPos-2,0);
		this.print("#AAA");
	}
	tileS.prototype.printPreview = function(){
		ctx2.clearRect(0,0, canvas.width, canvas.height);
		this.part1.printPreview(1,3);
		this.part2.printPreview(2,3);
		this.part3.printPreview(2,2);
		this.part4.printPreview(3,2);
	}
	
	// T		
	var tileT = function(){};
	tileT.prototype = new gameObject();
	tileT.prototype.init = function(xPos){
		this.xPos+=xPos;
		this.yPos+=0;
		this.part1.init(xPos,0);
		this.part2.init(xPos-1,0);
		this.part3.init(xPos,-1);
		this.part4.init(xPos+1,0);
		this.print("#AAA");
	}
	tileT.prototype.printPreview = function(){
		ctx2.clearRect(0,0, canvas.width, canvas.height);
		this.part1.printPreview(1,3);
		this.part2.printPreview(2,3);
		this.part3.printPreview(2,2);
		this.part4.printPreview(3,3);
	}

	// J
	var tileJ = function(){};
	tileJ.prototype = new gameObject();
	tileJ.prototype.init = function(xPos){
		this.xPos+=xPos;
		this.yPos+=0;
		this.part1.init(xPos,0);
		this.part2.init(xPos,-1);
		this.part3.init(xPos,-2);
		this.part4.init(xPos-1,-2);
		this.print("#AAA");
	}
	tileJ.prototype.printPreview = function(){
		ctx2.clearRect(0,0, canvas.width, canvas.height);
		this.part1.printPreview(1,1);
		this.part2.printPreview(2,1);
		this.part3.printPreview(2,2);
		this.part4.printPreview(2,3);
	}

	// L
	var tileL = function(){};
	tileL.prototype = new gameObject();
	tileL.prototype.init = function(xPos){
		this.xPos+=xPos;
		this.yPos+=0;
		this.part1.init(xPos,0);
		this.part2.init(xPos,-1);
		this.part3.init(xPos,-2);
		this.part4.init(xPos+1,-2);
		this.print("#AAA");
	}
	tileL.prototype.printPreview = function(){
		ctx2.clearRect(0,0, canvas.width, canvas.height);
		this.part1.printPreview(3,1);
		this.part2.printPreview(2,1);
		this.part3.printPreview(2,2);
		this.part4.printPreview(2,3);
	}

// CONTROLLER - GAME LOGIC
	
	function finishObject(obj){
		//we need to check if a part of the object is outside the canvas -> game over
		if(obj.part1.yPos<0||obj.part2.yPos<0||obj.part3.yPos<0||obj.part1.yPos<0){
			gameOver();
		}
		else{
			// add points
			points+=1;
			if(!(obj.part1.xPos<0||obj.part2.xPos<0||obj.part3.xPos<0||obj.part1.xPos<0)){
				placedBoxes[obj.part1.yPos][obj.part1.xPos] = $.extend({},obj.part1);
				placedBoxes[obj.part2.yPos][obj.part2.xPos] = $.extend({},obj.part2);
				placedBoxes[obj.part3.yPos][obj.part3.xPos] = $.extend({},obj.part3);
				placedBoxes[obj.part4.yPos][obj.part4.xPos] = $.extend({},obj.part4);
				log0("finished this object");
			}
			//everytime when a object is finished, we need to check if a line is completed and if so, remove it
			linesToClear = new Array();
			for(var i=0;i<24;i++){
				boxesInThisLine=0;
				for(var j=0;j<16;j++){
					if(placedBoxes[i]!=undefined){
						if(placedBoxes[i][j]!=undefined){
							log3("found box in line "+i);
							boxesInThisLine++;
						}
						if(boxesInThisLine>=16){
							//line is complete -> save this information
							log0("line "+i+" complete");
							linesToClear.push(i);
						}
					}
				}
			}
			//pull lines down
			for (var i = 0; i < linesToClear.length; i++) {
				for(var j = linesToClear[i]; j>0; j--){
					placedBoxes[j]=placedBoxes[j-1];
					// correct yPositions
					for(var k = 0; k < 16 ; k++){
						if(placedBoxes[j][k]!=undefined){
							placedBoxes[j][k].yPos+=1;
						}
					}
				}
				placedBoxes[0] = new Array();
				points+=10;
				// speed up
				delay = delay*0.9;
			};
			
			//update view
			$("#points").html(points);
		}
	}

	function gameOver(){
		log0("GAME OVER");
		gameover = true;
		ctx.clearRect(0,0, canvas.width, canvas.height);
		var boxes = new Array();
		// paint GAME OVER
		ctx.fillStyle = "#AAA";
		ctx.font = "200 58px Helvetica";
		ctx.fillText("game over",20,250);
 	}

 	function checkIfOutside(){
 		if(currObj.part1.xPos<0||currObj.part2.xPos<0||currObj.part3.xPos<0||currObj.part4.xPos<0){
 			moveObject(currObj,"right");
 			checkIfOutside();
 		}
 		else if(currObj.part1.xPos>15||currObj.part2.xPos>15||currObj.part3.xPos>15||currObj.part4.xPos>15){
 			moveObject(currObj,"left");
 			checkIfOutside()
 		}
 	}

	function printNextObject(){
		switch(nextObject){
			case 1:
				nextObj = new tileO();
				break;
			case 2:
				nextObj = new tileI();
				break;
			case 3:
				nextObj = new tileZ();
				break;
			case 4:
				nextObj = new tileT();
				break;
			case 5:
				nextObj = new tileJ();
				break;
			case 6:
				nextObj = new tileS();
				break;
			case 7:
				nextObj = new tileL();
				break;
			default:
				nextObj = new tileO();
				break;
		}
		nextObj.printPreview();
	}
	
	function createNewObject(){

		switch(nextObject){
			case 1:
				currX = getRandomInt(15,0);
				currObj = new tileO();
				break;
			case 2:
				currX = getRandomInt(16,0);
				currObj = new tileI();
				break;
			case 3:
				currX = getRandomInt(14,0);
				currObj = new tileZ();
				break;
			case 4:
				currX = getRandomInt(14,0);
				currObj = new tileT();
				break;
			case 5:
				currX = getRandomInt(16,0);
				currObj = new tileJ();
				break;
			case 6:
				currX = getRandomInt(14,0);
				currObj = new tileS();
				break;
			case 7:
				currX = getRandomInt(16,0)
				currObj = new tileL();
				break;
			default:
				currX = getRandomInt(15,0);
				currObj = new tileO();
				break;
		}
		currObj.init(currX); // <-- MAYBE WE CAN DO THIS IN A CONSTRUCTOR??
		log0("created a new object from preview");
		nextObject = getRandomInt(8,0);
		printNextObject();
	}
	
	function moveObject(obj,direction){
		log2("let's move "+ direction);
		//clear screen
		ctx.clearRect(0,0, canvas.width, canvas.height);
		//check if object reached bottom
		if((currObj.part1.yPos>=23||
				   currObj.part2.yPos>=23||
				   currObj.part3.yPos>=23||
				   currObj.part4.yPos>=23)
			&&direction=="down"){
		   	log1("can't move "+direction+", because there is the bottom.");
		    drop =false;
			finishObject(currObj);
			createNewObject();
		}
		//object did not touch bottom
		else{
			if(direction=="right"){
				x=1;
				y=0;
			}
			else if(direction=="left"){
				x=-1;
				y=0;
			}
			else{
				x=0;
				y=1;
			}
			//check if object touched already placed boxes
			touch = false;
			for(var i=0;i<24;i++){	
				for(var j=0;j<16;j++){
					if (placedBoxes[i][j]!=undefined){

						if(currObj.part1.xPos==j&&currObj.part1.yPos==i-1||
						   currObj.part2.xPos==j&&currObj.part2.yPos==i-1||
						   currObj.part3.xPos==j&&currObj.part3.yPos==i-1||
						   currObj.part4.xPos==j&&currObj.part4.yPos==i-1){
						   	if(direction=="down"){
								touch = true;	
								log1("can't move "+direction+", because there is already a box.");
							}
						}
						else{
							if(direction=="right"){
								if((currObj.part1.xPos==(j-1)&&currObj.part1.yPos==i)||
								   (currObj.part2.xPos==(j-1)&&currObj.part2.yPos==i)||
								   (currObj.part3.xPos==(j-1)&&currObj.part3.yPos==i)||
								   (currObj.part4.xPos==(j-1)&&currObj.part4.yPos==i)){
										touch = true;	
										log1("can't move "+direction+", because there is already a box.");
								}
							}
							else if(direction=="left"){
								if((currObj.part1.xPos==j+1&&currObj.part1.yPos==i)||
								   (currObj.part2.xPos==j+1&&currObj.part2.yPos==i)||
								   (currObj.part3.xPos==j+1&&currObj.part3.yPos==i)||
								   (currObj.part4.xPos==j+1&&currObj.part4.yPos==i)){
										touch = true;	
										log1("can't move "+direction+", because there is already a box.");
								}
							}
						}
					}
				}
			}
			if(!touch){
				currObj.move(x,y);
				checkIfOutside();
			}
			else
			{
				if(direction=="down"){
					finish = true;
					drop=false;
					finishObject(currObj);
					if(!gameover){
						createNewObject();
					}
				}
				else{
					currObj.print("#AAA");
				}
			}
		}
		if(!gameover){
			for(var i=0;i<24;i++){
				for(var j=0;j<16;j++){
					if(placedBoxes[i]!=undefined){
						if(placedBoxes[i][j]!=undefined){
							placedBoxes[i][j].print("#777");
							log3("printed placed box at "+i+","+j);
						}
					}
				}		
			}
		}
		if(drop){
			setTimeout(function(){
				moveObject(currObj,"down");	
			},delay/50);
		}
	}
	
	// GAME LOOP	

	function play(){
	
		setTimeout(function(){
			moveObject(currObj,"down");
			if(!gameover){
				play();
			}
		},delay);
	}
	
	//CREATE A TILE AND START THE GAME
	log0("WELCOME TO TETRIS.JS - SIMPLE JAVASCRIPT TETRIS");
	nextObject = getRandomInt(8,0);
	printNextObject();
	createNewObject();
	log0("Let's begin!");
	play();
	// KEY EVENTS
	$(document).keydown(function(event){
		if(!gameover){
			switch(event.keyCode){
				case 32: //space -> drop
					event.preventDefault();
					drop=true;
					moveObject(currObj,"down");
					break;
				case 37: //left key -> move left
					event.preventDefault();
					if(currObj.part1.xPos>0&&
						currObj.part2.xPos>0&&
						currObj.part3.xPos>0&&
						currObj.part4.xPos>0){
							moveObject(currObj,"left");
						}
					break;
				case 38: //up key -> rotate
					event.preventDefault();
					currObj.rotate();
					break;
				case 39: //right key -> move right
					event.preventDefault();
					if(currObj.part1.xPos<15&&
						currObj.part2.xPos<15&&
						currObj.part3.xPos<150&&
						currObj.part4.xPos<15){
							moveObject(currObj,"right");
						}
					break;
				case 40: // down key -> move down
					event.preventDefault();
					moveObject(currObj,"down");
					break;
			}
		}
	})
});