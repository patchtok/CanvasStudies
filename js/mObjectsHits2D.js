console.log("hello");
var canvas = document.getElementById('myCanvas');
var width = 10*Math.floor(document.getElementById("mn").offsetWidth/10);
var height = 0.75*10*Math.floor(width/10);
canvas.width = width;
canvas.height = height;
var c = canvas.getContext('2d');
document.getElementById("dims").innerHTML="Canvas: width= "+width+" , height= "+height;
//------------- variables and arrays
var colour1 = ['#ff0000' , '#0000ff', '#cccccc', '#ffffff'];
var objectSet = [];
var numberObjects = 0;
var minX = 0.1*width;
var maxX = 0.9*width;
var minY = 0.1*height;
var maxY = 0.9*height;
var standardRadius = 10;

var mouse = {
	x: undefined,
	y: undefined
}

var mDown = false;


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
    
    document.getElementById("mouseInfo").innerHTML = "Mouse x: "+mouse.x+" Mouse y: "+mouse.y;
    
    
    });

canvas.addEventListener('mousedown',
					   function(){
					mDown=true;
});

canvas.addEventListener('mouseup',
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
function backgroundElements(Xmin,Ymin, Xmax, Ymax ){
    c.beginPath();
	c.rect(Xmin, Ymin, Xmax - Xmin, Ymax - Ymin);
	c.strokeStyle = "#00dd00";
	c.lineWidth = 1;
	c.stroke();
	c.closePath();
    
}
// pythagoras
function pythagoras(a,b){
    return Math.sqrt( Math.pow( a , 2 ) + Math.pow( b , 2 ));
}
// check distance between two circles with given radii
function distanceCheck(x1,y1,x2,y2, r1, r2){
    var totalDistance=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
    if(totalDistance <= (r1 + r2) ) {
       return true;
       }else{return false;}
    }
// return distance between two points
function getDistance(xs,ys,xf,yf){
    var xDist=xs-xf;
	var yDist=ys-yf;
	var totalDist=Math.sqrt(Math.pow(xDist,2)+Math.pow(yDist,2));
	return totalDist; 
}
// reflected on x
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
// one dimensional collision
function getV_1(u_1,u_2,m_1,m_2){
    
    var v_1 = (u_1*(m_1 - m_2) + 2*u_2*m_2)/(m_2 + m_1);
    return v_1;
}

function getV_2(u_1,u_2,m_1,m_2){
    var v_2 = (u_2*(m_2 - m_1)+2*u_1*m_1)/(m_2 + m_1);
    return v_2;
    
}
// two dimensional collision
function getVx(v_1, v_2 , theta_1 , theta_2 , m_1 , m_2 , phi){
    var numerator = v_1*Math.cos( theta_1 - phi )*(m_1 - m_2) +2*m_2*v_2*Math.cos( theta_2 - phi );
    var denominator = m_1 + m_2;
    var temp = (numerator/denominator)*Math.cos( phi ) - v_1*Math.sin( theta_1 - phi )*Math.sin( phi );
    return temp;
    
}
function getVy(v_1, v_2 , theta_1 , theta_2 , m_1 , m_2 , phi){
    var numerator = v_1*Math.cos( theta_1 - phi )*(m_1 - m_2) +2*m_2*v_2*Math.cos( theta_2 - phi );
    var denominator = m_1 + m_2;
    var temp = (numerator/denominator)*Math.sin( phi ) + v_1*Math.sin( theta_1 - phi )*Math.cos( phi );
    return temp;
    
}

function writeToBox(x,y,txt){
c.fillStyle="#bbbbbb";
//c.fillRect(x-2,y-18, 100, 20);
c.font="12px Arial";
c.textAlign = "left";
c.fillStyle="#000000";
c.fillText(txt,x,y);
}
// draw line start x,y length, angle and colour (has arrowhead)
 function drawLine(x,y,l,theta, col){
    
     c.beginPath();
     c.moveTo(x,y);
     c.lineTo(x+l*Math.cos(theta), y+l*Math.sin(theta));
     c.lineWidth = 1;
     c.strokeStyle = col;
     c.fillStyle = col;
     c.stroke();
     c.moveTo(x+0.9*l*Math.cos(theta), y+0.9*l*Math.sin(theta));
     c.lineTo(x+0.9*l*Math.cos(theta)+0.05*l*Math.cos(theta+Math.PI/2), y+0.9*l*Math.sin(theta)+0.05*l*Math.sin(theta+Math.PI/2));
     c.lineTo(x+l*Math.cos(theta), y+l*Math.sin(theta));
     c.lineTo(x+0.9*l*Math.cos(theta)+0.05*l*Math.cos(theta-Math.PI/2), y+0.9*l*Math.sin(theta)+0.05*l*Math.sin(theta-Math.PI/2));
     c.closePath();
     c.fill();
     
 }

function drawParametricLine(x,y, theta, start, stop, col){
    // x+tcos(theta), y+tsin(theta);
    c.beginPath()
    c.moveTo(x+ start*Math.cos(theta), y+ start*Math.sin(theta));
    c.lineTo(x+ stop*Math.cos(theta), y+ stop*Math.sin(theta));
    c.strokeStyle = col;
    c.lineWidth = 1;
    c.stroke();
    
    
}

function lineBetweenPoints(x, y, a, b, col){
    c.beginPath();
    c.moveTo(x,y);
    c.lineTo(a,b);
    c.strokeStyle = col;
    c.lineWidth = 1;
    c.stroke();
}

// center x, y , radius , stroke (boolean), fill(boolean), stroke colour, fill colour
function circleDrawer(x,y,r,s,f,str,fll){
    c.beginPath();
    c.arc(x,y,r,0,Math.PI*2,false);
    c.strokeStyle = str;
    c.fillStyle = fll;
    if(s){c.stroke();}
    if(f){c.fill();}
}

// function test

//--------------------objects
function CircularDrag(x,y,width){
    this.lineRadius = width/2;
    this.angle = 0;
    this.x = x + this.lineRadius*Math.cos(this.angle);
    this.y = y + this.lineRadius*Math.sin(this.angle);
    this.xC = x;
    this.yC = y;
    this.buttonRadius = 10;
    this.moving = false;
    this.buttonColour = "#3355ff";
    this.colourUp = this.colour;
}

CircularDrag.prototype.draw = function(){
    circleDrawer(this.xC , this.yC,this.lineRadius, true, false, "#456789", "#9000dd");
    lineBetweenPoints(this.xC, this.yC, this.x, this.y, "#ff0000");
    circleDrawer(this.x, this.y,this.buttonRadius, false, true, "#456789", this.buttonColour );
}
// needs mouse position, mouse down (boolean)
CircularDrag.prototype.update = function(xm, ym,MD){
        this.display(this.xC, this.yC, Math.round(this.angle*180/Math.PI));
    
        if(getDistance(this.x,this.y, xm,ym) < this.buttonRadius){
            this.buttonColour = "#ff0000";
    
        if(MD){
                this.moving = true;
                this.buttonColour = "#ff6600";}
            }else{this.buttonColour = this.colourUp;}
            
        if(this.moving && !MD){ 
            this.moving = false;
                              }
        if(this.moving){
            this.buttonColour = "#ff6600"
            var ang = angleCalculate(this.xC, this.yC, xm,ym);
            var degrees = (Math.round(ang*180/Math.PI))%360;
            this.angle = ang;
            this.x=this.xC + this.lineRadius*Math.cos(ang);
			this.y=this.yC + this.lineRadius*Math.sin(ang);
            
        }
      
}

CircularDrag.prototype.display = function(x,y,txt) {
circleDrawer(x,y,0.7*this.lineRadius,false, true, "#000000", "#ffffff")
c.fillStyle="#bbbbbb";
//c.fillRect(x-2,y-18, 100, 20);
c.font="20px Arial";
c.textAlign = "center";
c.fillStyle="#000000";
c.fillText(txt,x,y+5); 
}

CircularDrag.prototype.getAngle =function(){
    
    return this.angle;
}


//takes name, init x,y, speed,travel angle, colour, minX, maxX, minY, maxY

function Planet(name,x,y,r,s,t,c, minX, maxX, minY, maxY){
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
	this.radius = r;
    this.mass = r
	this.bounceSet = [];
	this.count = 0;
    this.startSpeed = s;
}

Planet.prototype.getName = function(){
	return this.planetName;
}

// radius and boolean for stroke and fill
Planet.prototype.circleMake = function(r,s,f){
	c.beginPath();
	c.arc(this.x,this.y,r,0,Math.PI*2, true);
	c.lineWidth = 1;
	c.fillStyle = this.col;
	c.strokeStyle= this.col;
	if(s){c.stroke();}
	if(f){c.fill();}
    c.closePath();
    drawLine(this.x, this.y, 10*this.speed , this.tAngle, this.col);
    writeToBox(this.x, this.y, this.planetName);
}

Planet.prototype.draw = function(){	
	this.circleMake(this.radius,false, true);
    writeToBox(this.x, this.y, this.planetName);
	this.updatePosition(this.minX, this.maxX , this.minY, this.maxY , this.radius);
}

Planet.prototype.updatePosition = function(minX, maxX, minY, maxY, r){
	if(this.y < minY + r || this.y > maxY - r){
		this.tAngle = (2*Math.PI - this.tAngle)%(2*Math.PI);

	}
	if(this.x < minX + r || this.x > maxX - r){
		this.tAngle = (Math.PI - this.tAngle)%(2*Math.PI);;

	}
	this.count += 1;

	this.x += this.speed*Math.cos(this.tAngle);
	this.y += this.speed*Math.sin(this.tAngle);
	
}


Planet.prototype.getX = function(){
    return this.x;    
}

Planet.prototype.getY = function(){
    return this.y;
}

Planet.prototype.setX = function(x){
    this.x = x;    
}

Planet.prototype.setY = function(y){
    this.y = y;
}
Planet.prototype.getMass = function(){
    return this.mass;
}
Planet.prototype.getSpeed = function(){
    return this.speed;
}
Planet.prototype.getAngle =function() {
    return this.tAngle;
}

Planet.prototype.setSpeed = function(s){
    this.speed = s;
}

Planet.prototype.setAngle = function(t){
    this.tAngle = t;
}
//




// instantiation
var masses = [4,24,16,24,8,16,16,16];
var speeds = [1, 0, 2, 4, 0,4, 4,4];



numberObjects = masses.length-6;
for (var i = 0; i < numberObjects ; i++ ){
var obj="obj" + i.toString();
var startX = 0.5*width + 60*Math.cos(2*Math.PI*i/numberObjects);
var startY = 0.5*height + 60*Math.sin(2*Math.PI*i/numberObjects);;
var rad = masses[i];    
var tCol = colour1[i%colour1.length];
var setSpeed=Math.abs(speeds[i]);
var setAngle = 2*Math.PI*i/numberObjects;
objectSet[i]= new Planet(obj, startX, startY, rad, setSpeed, setAngle, tCol, minX, maxX, minY, maxY);	
}




// ------------- instantiation
var myController = new CircularDrag(0.9*width, 0.8*height, 100); 

//---------------animations
var m_1 = 40;
var m_2 = 80;
var xr_1 = 0.2*width;
var yr_1 = 0.2*height;
var ang = 190;
ang = ang*Math.PI/180;
var xr_2 = xr_1 + (m_1 + m_2)*Math.cos(ang);
var yr_2 = yr_1 + (m_1 + m_2)*Math.sin(ang);
var v_1 = 5;
var v_2 = 10;
var a_1 = 100;
a_1 = a_1*Math.PI/180;
var a_2 = -60;
a_2 = a_2*Math.PI/180;

var P1 = new Planet("m1", xr_1, yr_1, m_1, v_1, a_1, "#ff2255" , minX, maxX, minY, maxY);
var P2 = new Planet("m2", xr_2, yr_2, m_2, v_2, a_2, "#0066ff" , minX, maxX, minY, maxY);


var cXpoint = 0.6*width;
var cYpoint = 0.2*height;

var dXpoint = 0.6*width;
var dYpoint = 0.5*height;

var eXpoint = 0.6*width;
var eYpoint = 0.8*height;

var fXpoint = 0.3*width;
var fYpoint = 0.8*height;

function specialDraw(){
drawGrid_param('rgb(250,250,240)','rgb(255,200,200)');
backgroundElements(minX , minY , maxX , maxY);
myController.update(mouse.x, mouse.y, mDown);
myController.draw();
ang = myController.getAngle();
xr_2 = xr_1 + (m_1 + m_2)*Math.cos(ang);
yr_2 = yr_1 + (m_1 + m_2)*Math.sin(ang)  
P2.setX(xr_2);
P2.setY(yr_2);    

    
P1.circleMake(m_1, true, false);
P2.circleMake(m_2, true, false);

var m_1Angle = angleCalculate(xr_1, yr_1, xr_2 , yr_2);
document.getElementById("angle1").innerHTML = "m_1 angle: "+m_1Angle*180/Math.PI;

var m_2Angle = angleCalculate(xr_2, yr_2, xr_1 , yr_1);
document.getElementById("angle2").innerHTML = "m_2 angle: "+m_2Angle*180/Math.PI;

var contactAngle = (m_2Angle+Math.PI/2)%(2*Math.PI);
drawParametricLine(xr_2 + m_2*Math.cos(m_2Angle), yr_2 + m_2*Math.sin(m_2Angle),contactAngle,-100, 100, "#555555");
document.getElementById("contactAngle").innerHTML = "Contact angle: "+ Math.round((contactAngle)*180/Math.PI);
//
drawParametricLine(cXpoint , cYpoint , contactAngle, -100 , 100 , "#555555");
drawLine(cXpoint, cYpoint, 10*v_1 , a_1, "#ff2255");
drawLine(cXpoint, cYpoint, 10*v_2 , a_2, "#0066ff");
    
//drawParametricLine(dXpoint , dYpoint , movementAngle-contactAngle, -100 , 100 , "#000000");
drawParametricLine(dXpoint , dYpoint , contactAngle-contactAngle, -100 , 100 , "#555555");
drawLine(dXpoint, dYpoint, 10*v_1 , a_1-contactAngle, "#ff2255");
drawLine(dXpoint, dYpoint, 10*v_2 , a_2-contactAngle, "#0066ff"); 
    
   

lineBetweenPoints(dXpoint , dYpoint , dXpoint , dYpoint+10*v_1*Math.sin(a_1 - contactAngle), "#ff0000");
    //v_1*Math.sin(a_1 - contactAngle) collison vector for m_1
lineBetweenPoints(dXpoint , dYpoint , dXpoint +10*v_1*Math.cos(a_1 - contactAngle), dYpoint, "#ff0000");
    //v_1*Math.cos(a_1 - contactAngle)
lineBetweenPoints(dXpoint , dYpoint , dXpoint , dYpoint+10*v_2*Math.sin(a_2 - contactAngle), "#0000ff");
    //v_2*Math.sin(a_2 - contactAngle) collision vector for m_2
lineBetweenPoints(dXpoint , dYpoint , dXpoint +10*v_2*Math.cos(a_2 - contactAngle), dYpoint, "#0000ff");
    //v_2*Math.cos(a_2 - contactAngle)
var u_1 = v_1*Math.sin(a_1 - contactAngle);
var u_2 = v_2*Math.sin(a_2 - contactAngle);
//have m_1
//have m_2  
// getV_1(u_1,u_2,m_1,m_2)    
var v_1y = getV_1(u_1 , u_2, m_1, m_2);    
// getV_2(u_1,u_2,m_1,m_2)
var v_2y = getV_2(u_1 , u_2, m_1, m_2); 
var v_1x = v_1*Math.cos(a_1 - contactAngle);
var v_2x = v_2*Math.cos(a_2 - contactAngle);    
drawParametricLine(eXpoint , eYpoint , contactAngle-contactAngle, -100 , 100 , "#555555");   
lineBetweenPoints(eXpoint , eYpoint , eXpoint , eYpoint+10*v_1y, "#ff0000"); 
lineBetweenPoints(eXpoint , eYpoint , eXpoint , eYpoint+10*v_2y, "#0000ff"); 
lineBetweenPoints(eXpoint , eYpoint , eXpoint+10*v_1x , eYpoint, "#ff0000"); 
lineBetweenPoints(eXpoint , eYpoint , eXpoint+10*v_2x , eYpoint, "#0000ff"); 
var ang_1 = angleCalculate(0,0, v_1x, v_1y);
var v_1new = getDistance(0,0, v_1x, v_1y); 
drawLine(eXpoint, eYpoint, 10*v_1new, ang_1, "#ff0000"); 
var ang_2 = angleCalculate(0,0, v_2x, v_2y);
var v_2new = getDistance(0,0, v_2x, v_2y); 
drawLine(eXpoint, eYpoint, 10*v_2new, ang_2, "#0000ff");     
    
    
drawParametricLine(fXpoint , fYpoint , contactAngle-contactAngle+contactAngle, -100 , 100 , "#555555");
ang_1 = ang_1 + contactAngle;
ang_2 = ang_2 + contactAngle;
drawLine(fXpoint,fYpoint,10*v_1new, ang_1,"#ff0000"); 
drawLine(fXpoint,fYpoint,10*v_2new, ang_2,"#0000ff");     
    
    

    
}



//


function drawingFunctions(){
drawGrid_param('rgb(250,250,240)','rgb(255,200,200)');
backgroundElements(minX , minY , maxX , maxY);
//
    //newSet[0].draw();
    
//    
    

    
for( var i = 0; i < objectSet.length - 1 ; i++){
        for( var k = i+1 ; k < objectSet.length ; k++){
            
var ck = distanceCheck(objectSet[i].getX(), objectSet[i].getY(), objectSet[k].getX(), objectSet[k].getY(), objectSet[i].getMass(), objectSet[k].getMass());
            
            if(ck){
var ang = angleCalculate(objectSet[k].getX(), objectSet[k].getY(), objectSet[i].getX() , objectSet[i].getY());
    ang = ang +1.5*Math.PI;

                //v_1, v_2 , theta_1 , theta_2 , m_1 , m_2 , phi
var vxk = getVx(objectSet[i].getSpeed(),objectSet[k].getSpeed(),objectSet[i].getAngle(),objectSet[k].getAngle(),objectSet[i].getMass(),objectSet[k].getMass(),ang);
                
var vyk = getVy(objectSet[i].getSpeed(),objectSet[k].getSpeed(),objectSet[i].getAngle(),objectSet[k].getAngle(),objectSet[i].getMass(),objectSet[k].getMass(),ang);
                
var vxi = getVx(objectSet[k].getSpeed(),objectSet[i].getSpeed(),objectSet[k].getAngle(),objectSet[i].getAngle(),objectSet[k].getMass(),objectSet[i].getMass(),ang);
               
var vyi = getVy(objectSet[k].getSpeed(),objectSet[i].getSpeed(),objectSet[k].getAngle(),objectSet[i].getAngle(),objectSet[k].getMass(),objectSet[i].getMass(),ang);
                


var viAngle = angleCalculate(0,0, vxi, vyi);
var viSpeed = pythagoras(vxi,vyi);
               
var vkAngle = angleCalculate(0,0, vxk, vyk);
var vkSpeed = pythagoras(vxk,vyk);
             
                objectSet[i].setAngle(viAngle);
                objectSet[i].setSpeed(viSpeed);
                objectSet[k].setAngle(vkAngle);
                objectSet[k].setSpeed(vkSpeed);
                objectSet[i].draw();
                objectSet[k].draw();
                
                }
        }
    }
    
//    
for( var i = 0; i < objectSet.length - 1 ; i++){
        for( var k = i+1 ; k < objectSet.length ; k++){
            
var ck = distanceCheck(objectSet[i].getX(), objectSet[i].getY(), objectSet[k].getX(), objectSet[k].getY(), objectSet[i].getMass(), objectSet[k].getMass());
        if(ck){
            
            objectSet[i].draw();
            objectSet[k].draw();
            console.log("not clean");
            console.log(objectSet[i].getName());
            console.log(objectSet[k].getName());
            stop = true;
        }
        
        }
}

    
for( var i = 0; i < objectSet.length ; i++){
        
	objectSet[i].draw(); 
    }
    
    

}

var count = 0;
var counter = 0;
stop = false;
function animate() {
	count += 1;
	counter = count % 100;
	document.getElementById("countOut").innerHTML = counter;
   
	c.clearRect(0,0,width,height);
	specialDraw();
     if(stop == false){
	requestAnimationFrame(animate);}
}
animate();