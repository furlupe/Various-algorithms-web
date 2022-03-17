window.onload = function() {
    // Определение контекста рисования
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");  
}

let circles = [];
let id=0;

class Circle {
    constructor(x , y, radius, color) {
        this.id=id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.isSelected = false;
    }
}

canvas.onmousedown = function(event){
    let x = event.offsetX || 0;
    let y = event.offsetY || 0;
    id= ++id;
    // Создаем новый круг
    let circle = new Circle(x, y, 20, "pink");
    // Сохраняем его в массиве
    circles.push(circle);
    console.log(circles);
    drawCircles();
    if (circles.length >= 2){
        drawLine();
    }
}

function drawCircles() {
    // Перебираем все круги
    for(let i=0; i<circles.length; i++) {
        let circle = circles[i];
        // Рисуем текущий круг
        context.beginPath();
        context.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
        context.fillStyle = circle.color;
        context.strokeStyle = "black";
        context.fill();
        context.stroke(); 
    }
}

function drawLine() {
    let x0 = circles[circles.length-1].x;
    let y0 = circles[circles.length-1].y;
    for(let i=circles.length-2; i>=0; i--) {
        let x1 = circles[i].x;
        let y1 = circles[i].y;
        // Рисуем линии
        context.beginPath();
        context.moveTo(x0, y0); 
        context.lineTo(x1, y1);
        context.lineWidth = 3;         // толщина
        context.strokeStyle = 'black'; // цвет
        context.fill();
        context.stroke(); 
    }
}
