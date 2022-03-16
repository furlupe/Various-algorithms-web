var canvas = document.getElementById("canvas");
var ctx = canvas.getContex('2d');

var mouse ={x:0, y:0};
var pointSize = 3;

canvas.addEventListener("click", e =>{
    mouse.x = e.offsetX;
    mouse.y =e.offsetY;

    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, pointSize, 50, 50);
    ctx.fillStyle = ctx.strokeStyle = "black";
    ctx.fill();
    ctx.stroke();
});