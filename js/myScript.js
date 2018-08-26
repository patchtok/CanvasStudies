   //canvas height and width
   var width=0;
    var height=0;
    var cLeft=0;
    var cTop=0;
    var cRight=0;
    var cBottom=0;
    var xPos=0;
    var yPos=0;
    var positionString="";  

function drawGrid(){
        ctx.fillStyle="#ddaaaa";
        ctx.fillRect(0,0,width,height);
        for(i=1;i<=9;i++){
            var xcPos=(i/10)*width;
            var ycPos=(i/10)*height;
            ctx.fillStyle="#aaaaaa";
            ctx.fillRect(xcPos,0,1,height);
            ctx.fillRect(0,ycPos,width,1);
        }
    }
	
function drawGrid_param(f, g ){
        ctx.fillStyle=f;
        ctx.fillRect(0,0,width,height);
        for(i=1;i<=9;i++){
            var xcPos=(i/10)*width;
            var ycPos=(i/10)*height;
            ctx.fillStyle=g;
            ctx.fillRect(xcPos,0,1,height);
            ctx.fillRect(0,ycPos,width,1);
        }
    }

function reSizeCheck(){
        var rect=canvas.getBoundingClientRect();
        cLeft=rect.left;
        cTop=rect.top;
        cRight=rect.right;
        cBottom=rect.bottom;
        positionString="Left: "+cLeft+" Top: "+cTop+" Right: "+cRight+" Bottom: "+cBottom;
        document.getElementById("out1").innerHTML=positionString;
        width=10*Math.floor(document.getElementById("mn").offsetWidth/10);
        height=0.75*width;
        canvas.width=width;
        canvas.height=height;
        drawGrid();
        document.getElementById("out2").innerHTML="Width: "+width+" Height: "+height;
    
    }