window.onload = function() {
    // Определение контекста рисования
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");  
    context.beginPath();
    context.rect(0, 0, 900, 700);
    context.fillStyle = "white";
    context.fill();
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
let flag = false;

function geneticAlgorithm(){
    let generations = []; //массив где будут храниться все наши поколения (пути)
    let fitness = []; //массив с длинами путей
    let countElement = numberOfelement(circles.length - 1); //генерация оптимального(нет) кол-ва предков

    for (let i = 0; i < countElement; i++) { //генерация первого поколения 
        generations[i] = firstGeneration(generations); 
        if (flag == true) {
            generations.pop;
            continue;
        }
    }

    for (let i = 0; i < generations.length; i++) { //подсчет длин путей для каждого предка
        fitness[i] = distance(generations[i]); 
    }

    if(fitness.length == 2 && fitness[0] == fitness[1]) {
        console.log(generations[0]);
        console.log(fitness[0]);
    }

    
}

//генерация первого поколения
function firstGeneration (generations) {
    let editChromosome = [];

    editChromosome = circles.slice();
    editChromosome.shift();
    shuffle(editChromosome);
    editChromosome.push(circles[0]);
    editChromosome.unshift(circles[0]);

    //проверка на наличие
    for(let i = 0; i < generations.length; i++) {
        if (generations[i] == editChromosome) { 
            flag = true; 
            break;
        }
    }

    return editChromosome;
}

//кроссинговер или скрещивание
function crossoverBest(generation, fitness) {
    // let indexMin;
    // let indexPreMin;
    // let copy = fitness.slice();

    // copy.sort(function(a, b) {
    //     return a - b;
    // });

    // for(let i = 0; i < fitness.length; i++) {
    //     if(fitness[i] == copy[0]) {
    //         indexMin = i;
    //     }
    //     if(fitness[i] == copy[1]){
    //         indexPreMin = i;
    //     }
    // }

    //рандомно выбираем родителей
    let ancestor1 = generation[getRandomInt(generation.length - 1)];
    let ancestor2 = generation[getRandomInt(generation.length - 1)];
    // let length = ancestor1.length - 2;
    let child1;
    let child2;
    child1 = ancestor1.slice();

}

//нахождение дистанции(фитнесса)
function distance(chromosome) {
    let resultDistance = 0;

    for (let i = 0; i < chromosome.length - 1; i++) { //расстояние от точки до точки
        let xDist;
        let yDist;
        let Dist;

        xDist = Math.abs(chromosome[i].x - chromosome[i + 1].x);
        yDist = Math.abs(chromosome[i].y - chromosome[i + 1].y);
        Dist = Math.sqrt((Math.pow(xDist, 2)) + (Math.pow(yDist, 2)));
        resultDistance += Dist;
    }

    return resultDistance;
}

//перемешивание массива
function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

//нахождение оптимального(нет) кол-ва предков
function numberOfelement(length) {
    let fact = 1;
    if(length <= 3) {
        return 2;
    }
    for(let i = length; i > length - 2; i--){
        fact *= i;
    }
    return fact;
}

//среднее значение фитнесса
function averageFitness(distances) {
    let sumDist = 0;
    for(let i = 0; i < distances.length; i++) {
        sumDist += distances[i];
    }
    return sumDist / distances.length;
}

//рандом
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//выбор кол-ва генов для кроссинговера
function numberOfGenes(lengthOfChromosome) {
    if(lengthOfChromosome % 3 == 0) {

    }
}
