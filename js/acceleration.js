console.log("hello");
var canvas = document.getElementById('myCanvas');
var width = 10*Math.floor(document.getElementById("mn").offsetWidth/10);
var height = 0.75*10*Math.floor(width/10);
canvas.width = width;
canvas.height = height;
var c = canvas.getContext('2d');
document.getElementById("dims").innerHTML="Canvas: width= "+width+" , height= "+height;
//------------- variables and arrays
var minX = 0.1*width;
var maxX = 0.9*width;
var minY = 0.1*height;
var maxY = 0.9*height;

var stop = false;
//--------------listeners
document.getElementById("stopB").addEventListener('click',
                                                function() {
    stop = true;
    });

document.getElementById("startB").addEventListener('click',
                                                function() {
    stop = false;
    animate();
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

function calculateVector(xB,yB, xA, yA, a){
    var v = {x: undefined , y: undefined}
    if ((xB - xA) == 0 && (yB - yA) == 0){
        v.x = 0;
        v.y = 0;
        return v;
    }
    var unit = 1/Math.sqrt(Math.pow(xB - xA , 2) + Math.pow(yB - yA , 2));
    var ux = (xB - xA)*unit;
    var uy = (yB - yA)*unit;
    v.x = a*ux;
    v.y = a*uy;
    return v; 
}

//--------
var x1 = 300;
//var x1 = x1*width;
var y1 = 0.5;
var y1 = y1*height;

var x2 = 400;
//var x2 = x2*width;
var y2 = 0.5;
var y2 = y2*height;
var vx2 = 0;
var dx2 = 0;
var vy2 = 0;
var dy2 = 0;

var acc = 1;
var change = "increasing";
var velocityArray = [];

//--------
function drawingFunctions(){
drawGrid_param('rgb(250,250,240)','rgb(255,200,200)');
backgroundElements(minX , minY , maxX , maxY);
    // c_1
    
    circleDrawer(x1,y1, 20, false, true, "#000000", "#aa0000");
    circleDrawer(x2,y2, 10, false, true, "#000000", "#dd5500");
    console.log(vx2 + " , " + (Math.abs(x2-x1)));
    var aux = calculateVector(x1, y1, x2,y2, acc).x;
    var auy = calculateVector(x1, y1, x2,y2, acc).y;
    //console.log(calculateVector(x1, y1, x2,y2, acc).x);
    lineBetweenPoints(x2, y2,x2 + aux, y2 + auy, "#0000ff");
    
    dx2 = aux/2 + vx2;
    vx2 = aux + vx2;  
    x2 = x2 + dx2;
    
    
    dy2 = auy/2 + vy2;
    vy2 = auy + vy2;
    y2 = y2 + dy2;
}

var count = 0;
var counter = 0;

function animate() {
	count += 1;
	counter = count % 100;
	document.getElementById("countOut").innerHTML = counter;
   
	c.clearRect(0,0,width,height);
 drawingFunctions();
	//specialDraw();
     if(stop == false){
       requestAnimationFrame(animate);   
	}
   
}
animate();