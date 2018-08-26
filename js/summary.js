
var canvas = document.querySelector('canvas');
var width = 10*Math.floor(document.getElementById("mn").offsetWidth/10);
var height = 0.75*10*Math.floor(width/10);
canvas.width = width;
canvas.height = height;
var c = canvas.getContext('2d');

//--------------- arrays and variables
   //distance from mouse 
var dist = 50;
var colourA1 = [ '#A44365', '#EDAC52', '#315054', '#D74C41', '#302E49'];
var colourA2 = ['#333333', '#999999', '#bbbbbb' , '#dddddd', '#ffffff'];
var colourArray = colourA2;
var maxRadius = 40;
var circleArray = [];

var mouse = {
	x: undefined,
	y: undefined
}

//----------- listeners
window.addEventListener('load',
					  function(){
	document.getElementById("dims").innerHTML="Canvas: width= "+width+" , height= "+height;
} );

window.addEventListener('resize',
					   function() {
	width = 10*Math.floor(document.getElementById("mn").offsetWidth/10);
	height = 0.75*10*Math.floor(width/10);
	canvas.width = width;
	canvas.height = height;
	document.getElementById("dims").innerHTML="Canvas: width= "+width+" , height= "+height;
} );

canvas.addEventListener('mousemove',
					   function(event){
	mouse.x = event.offsetX;
	mouse.y = event.offsetY;
	document.getElementById("mousePos").innerHTML = "x mouse = " + mouse.x + " y mouse = "+ mouse.y;
	
});

canvas.addEventListener('mouseleave',
					   function(){
	
	mouse.x = -1000;
	mouse.y = -1000;
	document.getElementById("mousePos").innerHTML = "x mouse = " + mouse.x + " y mouse = "+ mouse.y;
	
});


//--------------objects
function Circle(x,y,dx,dy,radius){
	//constructors
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.minRadius = radius;
	this.colour=colourArray[Math.floor(Math.random()*colourArray.length)];
	//methods
	this.draw = function() {
		c.beginPath();
		c.arc(this.x,this.y,this.radius,0, Math.PI*2, false);
		c.strokeStyle = 'rgba(255,255,0,0.5)';
		c.fillStyle = this.colour;
		c.fill();	
	}
	// motion
	this.update = function() {
		if (this.x + this.radius > width || this.x - this.radius < 0){
			this.dx = -this.dx;
		}
		if (this.y + this.radius > height || this.y - this.radius < 0){
			this.dy = -this.dy;
		}
		
		this.x += this.dx;
		this.y += this.dy;
	
		if( Math.abs(mouse.x-this.x) < dist && Math.abs(mouse.y - this.y) < dist ){
			if(this.radius < maxRadius){this.radius +=1;}
			
		}else if (this.radius > this.minRadius ){
			this.radius -= 1;
		}
		
		this.draw();
	}
}


//-------------general functions
function drawGrid_param(f, g ){
        c.fillStyle=f;
        c.fillRect(0,0,width,height);
        for(i=1;i<=9;i++){
            var xcPos=(i/10)*width;
            var ycPos=(i/10)*height;
            c.fillStyle=g;
            c.fillRect(xcPos,0,1,height);
            c.fillRect(0,ycPos,width,1);
        }
    }
//----------------object instatiation
for ( var i = 0 ; i < 300 ; i++ ){
	var radius = Math.round(Math.random()*5+1);
	var x = radius+Math.random()*(width-radius*2);
	var dx = (Math.random()-0.5)*1;
	var y = radius+Math.random()*(height-radius*2);
	var dy = (Math.random()-0.5)*1;
	//
	circleArray.push(new Circle(x,y, dx, dy,radius));
	
}




function drawingFunctions(){
	drawGrid_param('rgb(240,240,240)','rgb(255,200,0)');
	for (var i = 0; i < circleArray.length ; i++){
		circleArray[i].update();
	}
}

var count = 0;
var counter = 0;
function animate() {
	count += 1;
	counter = count % 100;
	document.getElementById("countOut").innerHTML = counter;
	requestAnimationFrame(animate);
	c.clearRect(0,0,width,height);
	drawingFunctions();
}
animate();

