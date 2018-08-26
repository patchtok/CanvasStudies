var canvas = document.getElementById('myCanvas');
var width = 10*Math.floor(document.getElementById("mn").offsetWidth/10);
var height = 0.75*10*Math.floor(width/10);
canvas.width = width;
canvas.height = height;
var c = canvas.getContext('2d');
//------------- variables and arrays
var colour1 = ['#B2404F' , '#FFF965', '#FF8C9C', '#45C4FF', '#45C4FF','#FFFFFF'];
var objectSet = [];
var numberObjects = 0;

//--------------listeners

window.addEventListener('resize',
					   function() {
	width = 10*Math.floor(document.getElementById("mn").offsetWidth/10);
	height = 0.75*10*Math.floor(width/10);
	canvas.width = width;
	canvas.height = height;
	document.getElementById("dims").innerHTML="Canvas: width= "+width+" , height= "+height;
} );
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
//--------------------objects
//takes name, init x,y, speed,travel angle, colour, minX, maxX, minY, maxY

function Planet(name,x,y,s,t,c, minX, maxX, minY, maxY){
	this.planetName = name;
	this.xC = x;
	this.yC = y;
	this.x = x;
	this.y = y;
	this.speed = s;
	this.tAngle = t;
	this.col = c;
	this.minX = minX;
	this.maxX = maxX;
	this.minY = minY;
	this.maxY = maxY;
	this.radius = 3;
	this.bounceSet = [];
	this.count = 0;
}

Planet.prototype.getName = function(n){
	return n;
}

// radius and boolean for stroke and fill
Planet.prototype.circleMake = function(r,s,f){
	c.beginPath();
	c.arc(this.x,this.y,r,0,Math.PI*2, true);
	c.closePath();
	c.lineWidth = 5;
	c.fillStyle = this.col;
	c.strokeStyle= "#dd0000";
	if(s){c.stroke();}
	if(f){c.fill();}
}

Planet.prototype.draw = function(){
	c.beginPath();
	c.rect(this.minX, this.minY, this.maxX-this.minX, this.maxY - this.minY);
	c.strokeStyle = "#00dd00";
	c.lineWidth = 1;
	c.stroke();
	c.closePath();
	c.beginPath();
	c.moveTo(this.xC, this.yC);
	c.lineTo(this.x, this.y);
	c.strokeStyle = this.col;
	c.stroke();
	
	/*if( this.bounceSet.length >= 2){
		
	c.moveTo(this.bounceSet[0],this.bounceSet[1]);
		
	for( var i=2; i<this.bounceSet.length-1; i += 2){
	c.lineTo(this.bounceSet[i],this.bounceSet[i+1]);
	}
		
	c.strokeStyle = "rgba(0,0,200, 0.3)";
	c.stroke();
		
	}*/
	
	this.circleMake(this.radius,false, true);
	this.updatePosition(this.minX, this.maxX , this.minY, this.maxY , this.radius);
}

Planet.prototype.updatePosition = function(minX, maxX, minY, maxY, r){
	if(this.y < minY + r || this.y > maxY - r){
		this.tAngle = 2*Math.PI - this.tAngle;
		//this.bounceSet.push(this.x);
		//this.bounceSet.push(this.y);
	}
	if(this.x < minX + r || this.x > maxX - r){
		this.tAngle = Math.PI - this.tAngle;
		//this.bounceSet.push(this.x);
		//this.bounceSet.push(this.y);
	}
	this.count += 1;
	/*if(this.count%310 == 0){
		this.speed = - this.speed;
	}*/
	this.x += this.speed*Math.cos(this.tAngle);
	this.y += this.speed*Math.sin(this.tAngle);
	
}


// -----------------instantiation


//takes name, init x,y, speed,travel angle, colour, minX, maxX, minY, maxY
//var a = 0.625*2*Math.PI;
//var Ocol = colour1[2];
//var p = new Planet("Earth",width/2,height/2,8,a,Ocol,0.1*width,0.9*width,0.1*height,0.9*height);

numberObjects = 120;
for (var i = 0; i < numberObjects ; i++ ){
var obj="obj" + i.toString();
var a = i*2*Math.PI/numberObjects;
var tCol = colour1[i%colour1.length];
objectSet[i]= new Planet(obj,width/2,height/2,i%3+1,a,tCol,0.1*width,0.9*width,0.1*height,0.9*height);	
}


//---------------animations
function drawingFunctions(){
drawGrid_param('rgb(250,250,240)','rgb(100,255,200)');
for( var i = 0; i < objectSet.length ; i++){
	objectSet[i].draw();
}	
//p.draw();	
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