
//points are ordered pairs {x,y}

//this object represents one bezier curve
class Curve{

	//points = [];

	constructor(p0){
		this.points = [];
		this.points.push(p0);
	}

	addPoint(p){
		if(this.points.length < 4){
			this.points.push(p);
			return true;
		}
		else { return false; }
	}

	drawCurve(ctx){
		if(this.points.length == 4){
			ctx.strokeStyle = "black";
			drawBezierInfo(ctx, this.points, gDepth, gInfo, gInfoRec);
		}
	}

	drawControl(ctx){
		ctx.strokeStyle = "lightgrey";
		drawLines(ctx, this.points);
		this.drawCurve(ctx);
	}
}

class Point{

	//x;
	//y;

	constructor(x,y){
		this.x = x;
		this.y = y;
	}

	draw(ctx){
		var a = 2;
		ctx.fillRect(this.x-a, this.y-a, 2*a, 2*a);
	}

	static avg(p1,p2){
		var avg = new Point(0,0);
		avg.x = (p1.x+p2.x) / 2;
		avg.y = (p1.y+p2.y) / 2;
		return avg;
	}
}


var canvas;
var ctx;
var rect;

//temp
var currentCurve;
//for demonstration purposes
var gDepth = 8;
var gInfo = false;
var gInfoRec = false;

//is called when page loads
function start(){

	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	rect = canvas.getBoundingClientRect();


	//runtime

}

var curveElements = [];
var pointElements = [];
function displayElements(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for(i in curveElements){
		curveElements[i].drawControl(ctx);
	}
	for(i in pointElements){
		pointElements[i].draw(ctx);
	}
	
}

//INPUT

//mouse click
document.addEventListener("click", function(e){
	rect = canvas.getBoundingClientRect();
	var mx = e.clientX - rect.left;
	var my = e.clientY  - rect.top;
	console.log(mx,my);
	handleClick(mx,my);
});
//touch on touchscreen
document.addEventListener("touchstart", function(r){
	rect = canvas.getBoundingClientRect();
	e.preventDefault();
	var mx = e.touches[0].clientX - rect.left;
	var my = e.touches[0].clientY  - rect.top;
	console.log(mx,my);
	handleClick(mx,my);
});

function handleClick(mx,my){
		var p0 = new Point(mx,my);
	pointElements.push(p0);
	//p0.draw(ctx);
	if(currentCurve == null){
		currentCurve = new Curve(p0);
		curveElements.push(currentCurve);
	}
	else{
		if(currentCurve.addPoint(p0)){

		}
		else { 
			currentCurve = new Curve(p0);
			curveElements.push(currentCurve);
		}
		//currentCurve.drawControl(ctx);
		console.log(currentCurve);
	}

	displayElements();

}

//temporary display toggles
document.addEventListener("keydown", function(e){
	if(e.keyCode == 81){
		// Q - toggle bezier algorithm demonstration
		gInfo = !gInfo;
	}
	if(e.keyCode == 87){
		// W - toggle bezier algorithm demonstration recursion
		gInfoRec = !gInfoRec;
	}
	if(e.keyCode == 88){
		// X - increase bezier recursion depth
		gDepth ++;
	}
	if(e.keyCode == 89 && gDepth > 0){
		// Y - decrease bezier recursion depth
		gDepth --;
	}
	if(e.keyCode == 46){
		//delete all curves
		pointElements = [];
		curveElements = [];
		currentCurve = null;
	}

	displayElements();	
});

//STATIC UTILITY FUNCTIONS

function drawBezier(ctx, points, depth){
	if(depth == 0){
		drawLines(ctx, points);
	}
	else{

		var ab = Point.avg(points[0], points[1]);
		var bc = Point.avg(points[1], points[2]);
		var cd = Point.avg(points[2], points[3]);
		var abc = Point.avg(ab, bc);
		var bcd = Point.avg(bc, cd);
		var abcd = Point.avg(abc, bcd);

		drawBezier(ctx, [points[0], ab, abc, abcd], depth-1);
		drawBezier(ctx, [abcd, bcd, cd, points[3]], depth-1);
	}
}

function drawLines(ctx, points){
		ctx.beginPath();
		ctx.moveTo(points[0].x, points[0].y);
		for(var i = 1; i < points.length; i++){
			ctx.lineTo(points[i].x, points[i].y);
		}
		ctx.stroke();
}

function drawPoint(ctx, point, r){

}

function drawBezierInfo(ctx, points, depth, on, rec){
	if(depth == 0){
		drawLines(ctx, points);
	}
	else{
		var ab = Point.avg(points[0], points[1]);
		var bc = Point.avg(points[1], points[2]);
		var cd = Point.avg(points[2], points[3]);
		var abc = Point.avg(ab, bc);
		var bcd = Point.avg(bc, cd);
		var abcd = Point.avg(abc, bcd);
			
		if(on){
			ctx.strokeStyle = "blue";
			drawLines(ctx, [ab,bc,cd]);
			ctx.strokeStyle = "red";
			drawLines(ctx, [abc,bcd]);
			if(!rec){abcd.draw(ctx);}
			ctx.strokeStyle = "black";
		}

		if(rec){
			drawBezierInfo(ctx, [points[0], ab, abc, abcd], depth-1, on, rec);
			drawBezierInfo(ctx, [abcd, bcd, cd, points[3]], depth-1, on, rec);
		}
		else{
			drawBezier(ctx, [points[0], ab, abc, abcd], depth-1);
			drawBezier(ctx, [abcd, bcd, cd, points[3]], depth-1);
		}

	}
}