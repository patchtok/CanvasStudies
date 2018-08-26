console.log("hello");
var canvas = document.getElementById('myCanvas');
var width = 10*Math.floor(document.getElementById("mn").offsetWidth/10);
var height = 0.75*10*Math.floor(width/10);
canvas.width = width;
canvas.height = height;
var c = canvas.getContext('2d');
document.getElementById("dims").innerHTML="Canvas: width= "+width+" , height= "+height;
//------------- variables and arrays
var colour1 = ['#000000' , '#666666', '#cccccc', '#ffffff'];
var objectSet = [];
var numberObjects = 0;
var minX = 0.1*width;
var maxX = 0.9*width;
var minY = 0.1*height;
var maxY = 0.9*height;
var standardRadius = 10;

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
function backgroundElements(Xmin,Ymin, Xmax, Ymax ){
    c.beginPath();
	c.rect(Xmin, Ymin, Xmax - Xmin, Ymax - Ymin);
	c.strokeStyle = "#00dd00";
	c.lineWidth = 1;
	c.stroke();
	c.closePath();
    
}
// check distance between two circles with given radii
function distanceCheck(x1,y1,x2,y2, r1, r2){
    var totalDistance=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
    if(totalDistance <= (r1 + r2) ) {
       return true;
       }else{return false;}
    }

function v_1(u_1,u_2,m_1,m_2){
    
    var v_1 = (u_1*(m_1 - m_2) + 2*u_2*m_2)/(m_2 + m_1);
    return v_1;
}

function v_2(u_1,u_2,m_1,m_2){
    var v_2 = (u_2*(m_2 - m_1)+2*u_1*m_1)/(m_2 + m_1);
    return v_2;
    
}


//--------------------objects
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
	this.circleMake(this.radius,false, true);
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
// instantiation
var masses = [2,16,8,8,3,9,12,12];
var speeds = [4, -1, 2, 1, 3,0, 0,2];
var position = [0.2*width, 0.8*width, 0.2*width, 0.5*width, 0.2*width, 0.5*width, 0.3*width, 0.7*width];


numberObjects = 8;
for (var i = 0; i < numberObjects ; i++ ){
var obj="obj" + i.toString();
var startX = position[i];
var startY = 0.2*height+Math.floor(i/2)*0.2*height;
var rad = masses[i];    
var tCol = colour1[i%colour1.length];
var setSpeed=Math.abs(speeds[i]);
var setAngle = 0;
if(speeds[i]<0){setAngle=Math.PI; }
objectSet[i]= new Planet(obj, startX, startY, rad, setSpeed, setAngle, tCol, minX, maxX, minY, maxY);	
}



//---------------animations
function drawingFunctions(){
drawGrid_param('rgb(250,250,240)','rgb(255,200,200)');
backgroundElements(minX , minY , maxX , maxY);
    
    
    for( var i = 0; i < objectSet.length ; i++){
	objectSet[i].draw();
       
    }
    var tempString = Math.round(180*objectSet[0].getAngle()/Math.PI);
    document.getElementById("angleOut").innerHTML=tempString;
    
    
    
    for( var i = 0; i < objectSet.length - 1 ; i++){
        
    for( var k = i+1 ; k < objectSet.length ; k++){
            var ck = distanceCheck(objectSet[i].getX(), objectSet[i].getY(), objectSet[k].getX(), objectSet[k].getY(), objectSet[i].getMass(), objectSet[k].getMass());
            if(ck){
var u_1 = objectSet[i].getSpeed()*Math.cos(objectSet[i].getAngle());
var u_2 = objectSet[k].getSpeed()*Math.cos(objectSet[k].getAngle());
var m_1 = objectSet[i].getMass();
var m_2 = objectSet[k].getMass();
var vv_1 = v_1(u_1,u_2,m_1,m_2);
var vv_2 = v_2(u_1,u_2,m_1,m_2);
                console.log(vv_1);

                
objectSet[i].setSpeed(Math.abs(vv_1));
objectSet[k].setSpeed(Math.abs(vv_2));
if(vv_1 < 0){objectSet[i].setAngle(Math.PI);}else{objectSet[i].setAngle(0);}
if(vv_2 < 0){objectSet[k].setAngle(Math.PI);}else{objectSet[k].setAngle(0);}
                
                

                
                console.log("hit");}
        }
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