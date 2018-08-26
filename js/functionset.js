// calculate angle of line between two points xs, ys is origin
// plane is reflection on x-axis of Cartesian
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
	
// calculate distance between 2 points
function distanceCheck(xs,ys,xf,yf){
var xDist=xs-xf;
var yDist=ys-yf;
var totalDist=Math.sqrt(Math.pow(xDist,2)+Math.pow(yDist,2));
return totalDist;
}
// round a number n to d decimal places 
function rounder(n,d){
	var temp=n*Math.pow(10,d);
	temp=Math.round(temp)/Math.pow(10,d);
	return temp;
}
//draw line start and end line width and stroke colour
function drawLine(xs,ys,xf,yf, w,s){
	ctx.beginPath();
	ctx.lineWidth=w;
	ctx.moveTo(xs,ys);
	ctx.lineTo(xf,yf);
	ctx.strokeStyle=s;
	ctx.stroke();
}
// draw a circle radius stroke fill (t,f) fill and stroke colour	
function circleMake(x,y,r,s,f,fs,ss){
	ctx.beginPath();
	ctx.arc(x,y,r, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.lineWidth=1;
	ctx.fillStyle=fs;
	ctx.strokeStyle=ss;
	if(s){ctx.stroke();}
	if(f){ctx.fill();}
}
	
function arcMake(x,y,r,starta,enda,s,f,fs,ss){
	ctx.beginPath();
	ctx.moveTo(x,y);
	ctx.arc(x,y,r, starta, enda, false);
	ctx.lineTo(x,y);
	ctx.lineWidth=1;
	ctx.fillStyle=fs;
	ctx.strokeStyle=ss;
	if(s){ctx.stroke();}
	if(f){ctx.fill();}
}	
