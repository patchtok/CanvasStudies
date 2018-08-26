console.log("hello");
var canvas = document.querySelector('canvas');
var width = 10*Math.floor(document.getElementById("mn").offsetWidth/10);
var height = 0.75*10*Math.floor(width/10);
canvas.width = width;
canvas.height = height;
var c = canvas.getContext('2d');
//------------- variables and arrays
var mouse = {
	x: undefined,
	y: undefined
}

var colourA1 = [ '#ff00ff', '#00ff00', '#0000ff', '#ffff00', '#00ffff'];
var colourA2 = ['#333333', '#999999', '#bbbbbb' , '#dddddd', '#ffffff'];
var colourArray = colourA1;
var mDown=false;
var objArray=[];

//--------------listeners

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
window.addEventListener('mousedown',
					   function(){
					mDown=true;
});
window.addEventListener('mouseup',
					   function(){
						mDown=false;
});

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



//--------------objects
function Circle(x,y,dx,dy,radius){
	//constructors
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.minRadius = radius;
	this.moving=false;
	this.colour=colourArray[Math.floor(Math.random()*colourArray.length)];
	this.colourUp=this.colour;
	//methods
	// calculate distance between 2 points
	this.distanceCheck =function(xs,ys,xf,yf){
	var xDist=xs-xf;
	var yDist=ys-yf;
	var totalDist=Math.sqrt(Math.pow(xDist,2)+Math.pow(yDist,2));
	return totalDist;
	}
	
	this.draw = function() {
		c.beginPath();
		c.arc(this.x,this.y,this.radius,0, Math.PI*2, false);
		c.strokeStyle = 'rgba(255,255,0,0.5)';
		c.fillStyle = this.colour;
		c.fill();	
	}
	// motion
	this.update = function(x,y,m, n) {
		var d=this.distanceCheck(this.x,this.y,x,y);
		if(m && d<this.radius && !n){
			this.moving=true;
		}
		if(!m){
			this.moving=false;
			this.colour=this.colourUp;
		}
		if(this.moving){
			this.x=x;
			this.y=y;
			this.colour='rgba(255,0,0,1)';
		}
		//this.draw();
	}
	
	this.getMoving =function (){
		return this.moving;
	}
}
function LineWithC(x,y,radius){
	//constructors
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.moving=false;
	this.colour=colourArray[Math.floor(Math.random()*colourArray.length)];
	this.colourUp=this.colour;
	//methods
	
	// calculate distance between 2 points
	this.distanceCheck =function(xs,ys,xf,yf){
	var xDist=xs-xf;
	var yDist=ys-yf;
	var totalDist=Math.sqrt(Math.pow(xDist,2)+Math.pow(yDist,2));
	return totalDist;
	}
	
	this.draw = function() {
		c.beginPath();
		c.moveTo(this.x,0);
		c.lineTo(this.x,this.y);
		c.strokeStyle='rgba(0,255,0,1)';
		c.stroke();
		c.beginPath();
		c.arc(this.x,this.y,this.radius,0, Math.PI*2, false);
		c.strokeStyle = 'rgba(255,255,0,1)';
		c.fillStyle = this.colour;
		c.fill();	
	}
	// motion
	//recieving x mouse y mouse mouse down boolean and moving boolean
	//of other objects (any other object true => n is true)
	this.update = function(x,y,m,n) {
		var d=this.distanceCheck(this.x,this.y,x,y);
		if(m && d<this.radius && !n){
			this.moving=true;
		}
		if(!m){
			this.moving=false;
			this.colour=this.colourUp;
		}
		if(this.moving){
			this.x=x;
			this.y=y;
			this.colour='rgba(0,255,0,1)';
		}
		//this.draw();
	}
	
	this.getMoving =function (){
		return this.moving;
	}
}

//----------------object instantiation
var ObjInterval=0.1*width;
var ObjHeight=0.3*height;
for(var i=0; i<10 ; i += 2){
	objArray[i]=new Circle(ObjInterval+ObjInterval*i, ObjHeight,0,0,20);
	objArray[i+1]=new LineWithC(ObjInterval+ObjInterval*i, 2*ObjHeight,20);
}
console.log(objArray);



// --------------- animations
function drawingFunctions(){
	drawGrid_param('rgb(240,240,240)','rgb(255,200,0)');
	for(var i=0;i<objArray.length; i++){
		var temp=false;
		for(var k=0; k<objArray.length; k++){
			if(k!=i){
				if(objArray[k].getMoving()){temp=true;}
			}
		}
		objArray[i].update(mouse.x,mouse.y,mDown,temp);
	}
	
	for(var i=0;i<objArray.length; i++){
		objArray[i].draw();
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
