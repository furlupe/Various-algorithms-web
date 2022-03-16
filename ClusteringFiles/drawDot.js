var canvas = document.getElementById("currCanvas"); //поле, куда ставим точки
var ctx = canvas.getContext('2d') //его содержимое

var mouse = {x:0, y:0}; //позиция курсора
var pointSize = 3; //размер точки

//рисуем точку по клику мыши
canvas.addEventListener("click", e => {
    //находим координаты, чтобы точку нарисовать
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;

    ctx.beginPath(); //начали рисовать
    ctx.arc(mouse.x, mouse.y, pointSize, 0, Math.PI * 2); //функция кружочка - рисуем точку
    ctx.fillStyle = ctx.strokeStyle = 'black'; //задаём цвет
    ctx.fill(); //заполнили + закончили рисовать
    ctx.stroke(); //показали результат        
});