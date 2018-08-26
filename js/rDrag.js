console.log("hello");
var canvas = document.getElementById('myCanvas');
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
var tMouse = {
	x: undefined,
	y: undefined
	
}
var mDown=false;
var mouseMoveRight = undefined;
var mouseMoveUp = undefined;

var colourA1 = [ '#ff00ff', '#00ff00', '#0000ff', '#ffff00', '#00ffff'];
var colourA2 = ['#333333', '#999999', '#bbbbbb' , '#dddddd', '#ffffff'];
var colourArray = colourA1;

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
	tMouse.x = mouse.x;
	tMouse.y = mouse.y;
	mouse.x = event.offsetX;
	mouse.y = event.offsetY;
	
	if(tMouse.x<mouse.x){ mouseMoveRight =true;
						}else{mouseMoveRight =false;}
	if(tMouse.y>mouse.y){ mouseMoveUp =true;
						}else{mouseMoveUp =false;}
	
	document.getElementById("mouseRight").innerHTML = "Mouse right: "+mouseMoveRight;
	document.getElementById("mouseUp").innerHTML = "Mouse up: "+mouseMoveUp;
	document.getElementById("tMousePos").innerHTML = "x tmouse = " + tMouse.x + " y tmouse = "+ tMouse.y;
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
//------- objects
function CircularDrag(xc,yc,r){
	// constructors
	this.lineRadius = 100;
	this.x = xc + this.lineRadius*Math.cos(0);
	this.y = yc + this.lineRadius*Math.sin(0);
	this.xCentre = xc;
	this.yCentre = yc;
	this.radius = r;
	this.moving = false;
	this.colour = colourArray[Math.floor(Math.random()*colourArray.length)];
	this.colourUp = this.colour;
	
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
		c.arc(this.xCentre,this.yCentre,this.lineRadius,0, Math.PI*2, false);
		c.strokeStyle = "rgb(255,100,0,1)";
		c.stroke();
		c.beginPath();
		c.arc(this.xCentre,this.yCentre,this.radius,0, Math.PI*2, false);
		c.fillStyle = 'rgba(0,0,200,1)';
		c.fill();
		c.beginPath();
		c.moveTo(this.xCentre,this.yCentre);
		c.lineTo(this.x,this.y);
		c.strokeStyle = 'rgba(255,100,0,1)';
		c.stroke();
		c.beginPath();
		c.arc(this.x,this.y,this.radius,0, Math.PI*2, false);
		c.fillStyle = this.colour;
		c.fill();
		
	}
	
	this.angleCalculate = function(xs,ys,xf, yf){
			var angle=0;
			var xD=xf-xs;
			var yD=yf-ys;
			if(xD==0){
				if(yf<ys){angle=3*Math.PI/2;}else{angle=Math.PI/2;}
			}else{
				var angle=Math.atan(yD/xD);
			}
			if(xf<xs){angle=angle+Math.PI;}
			if(xf>xs && yf<ys){angle=angle+2*Math.PI;}
			if(xD==0 && yD==0){angle=0;}
			return angle;
	}
	
	this.update = function(x,y,m,n){
		var d=this.distanceCheck(this.x,this.y,x,y);
		if(m && d<this.radius && !n){
			this.moving=true;
		}
		if(!m || d>10*this.radius){
			this.moving=false;
			this.colour=this.colourUp;
		}
	
		var ang=this.angleCalculate(this.xCentre,this.yCentre, x, y);
		var degrees = (Math.round(ang*180/Math.PI))%360;
		document.getElementById("angleOut").innerHTML = "Angle = "+degrees;
		

		
		if(this.moving &&  degrees>=0 && degrees <= 270){
			this.colour='rgba(255,0,0,1)';
			this.x=xc + this.lineRadius*Math.cos(ang);
			this.y=yc + this.lineRadius*Math.sin(ang);
		}
		
	}
	
	this.getXY = function(){
		return {x: this.x, y: this.y}
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

function angleCalculate(xs,ys,xf, yf){
			var angle=0;
			var xD=xf-xs;
			var yD=yf-ys;
			if(xD==0){
				if(yf<ys){angle=3*Math.PI/2;}else{angle=Math.PI/2;}
			}else{
				var angle=Math.atan(yD/xD);
			}
			if(xf<xs){angle=angle+Math.PI;}
			if(xf>xs && yf<ys){angle=angle+2*Math.PI;}
			if(xD==0 && yD==0){angle=0;}
			return angle;
	}
// -----------------instantiation
myC=new CircularDrag(width/2,height/2,5);
//---------------animations
function drawingFunctions(){
drawGrid_param('rgb(250,250,240)','rgb(100,255,200)');
myC.update(mouse.x,mouse.y, mDown, false );
myC.draw();
	
	
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

