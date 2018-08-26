function Body(name , x , y , v , vAngle , a , aAngle, r, minX, maxX, minY, maxY){
    this.name = name;
    this.minX = minX;
	this.maxX = maxX;
	this.minY = minY;
	this.maxY = maxY;
    this.col = "#000033";
    this.x = x;
    this.y = y;
    this.v = v;
    this.vAngle = vAngle*Math.PI/180;
    this.a = a;
    this.aAngle = aAngle*Math.PI/180;
    this.radius = r;
    this.t = 0;
    
    this.xinit = this.x;
    this.yinit = this.y;
    this.v_x_init = v*Math.cos(this.vAngle);
    this.v_y_init = v*Math.sin(this.vAngle);
    this.a_x = a*Math.cos(this.aAngle);
    this.a_y = a*Math.sin(this.aAngle);
    
    
}

Body.prototype.createBody = function(){
   c.beginPath();
	c.arc(this.x,this.y,this.radius,0,Math.PI*2, true);
	c.closePath();
	c.lineWidth = 5;
	c.fillStyle = this.col;
	c.fill();
    c.beginPath()
    c.moveTo(this.x, this.y);
    var a = this.calculateVangle();
    c.lineTo(this.x + 50*this.currentVelocity()*Math.cos(a), this.y + 50*this.currentVelocity()*Math.sin(a));
    c.strokeStyle = "#0000ff";
    c.stroke();
    
}


Body.prototype.draw = function(){
    this.createBody();
    this.t += 1;
    if(this.t>2){
    this.update();}
    this.move();
    
    
}

Body.prototype.calculateVangle = function(){
    var dx = this.a_x*this.t + this.v_x_init;
    var dy = this.a_y*this.t + this.v_y_init;
    if(dx==0){
        if(dy<0){ return 1.5*Math.PI;}
        if(dy>0){return 0.5*Math.PI;}
        if(dy==0){return 0;}
    }else{
    var vAngCurrent = Math.atan(dy/dx);
        if (dx<0){return Math.PI+vAngCurrent;}else{return vAngCurrent;}
    
    }
       
}
Body.prototype.currentVelocity = function(){
    var dx = this.a_x*this.t + this.v_x_init;
    var dy = this.a_y*this.t + this.v_y_init;
    return Math.sqrt( Math.pow( dx ,2 ) + Math.pow( dy , 2));
    
}

Body.prototype.update = function(){
   
   
    
    
    if(this.y < this.minY + this.radius || this.y > this.maxY - this.radius){
        
        
       //console.log(this.currentVelocity());
        this.vAngle = (2*Math.PI - this.vAngle)%(2*Math.PI);
        this.xinit = this.x;
        this.yinit = this.y;
        this.v_x_init = this.v*Math.cos(this.vAngle);
        this.v_y_init = this.v*Math.sin(this.vAngle);
        this.t = 0;
        
		
        

	}
	if(this.x < this.minX + this.radius || this.x > this.maxX - this.radius){
       
		
         
        this.vAngle = (Math.PI - this.vAngle)%(2*Math.PI);
        this.xinit = this.x;
        this.yinit = this.y;
        this.v_x_init = this.v*Math.cos(this.vAngle);
        this.v_y_init = this.v*Math.sin(this.vAngle);
        this.t = 0;
        
        

	}
  
     
    
}

Body.prototype.move = function(){
    this.vAngle = this.calculateVangle();
    this.v = 1*this.currentVelocity();
    this.x=this.a_x*Math.pow(this.t, 2)/2+this.v_x_init*this.t+this.xinit;
    this.y=this.a_y*Math.pow(this.t, 2)/2+this.v_y_init*this.t+this.yinit; 
}
