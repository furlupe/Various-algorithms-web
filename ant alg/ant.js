window.onload = function() {
    // Определение контекста рисования
    canvas2 = document.getElementById("canvas2");
    canvas1 = document.getElementById("canvas1");
    context1 = canvas1.getContext("2d");
    context2 = canvas2.getContext("2d");  
    context2.beginPath();
    context2.rect(0, 0, 900, 700);
    context2.fillStyle = "rgba(0, 0, 0, 0)";
    context2.fill();
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

canvas2.onmousedown = function(event){
    let x = event.offsetX || 0;
    let y = event.offsetY || 0;
    id= ++id;
    // Создаем новый круг
    let circle = new Circle(x, y, 20, "");
    // Сохраняем его в массиве
    circles.push(circle);
    console.log(circles);
    
   
    // if (circles.length >= 2){
    //     drawLine();
    // } 
    drawCircles();
    circles.forEach(function(item) {
        drawCText(item);
    })
}

function drawCircles() {
    // Перебираем все круги
    for(let i=0; i<circles.length; i++) {
        let circle = circles[i];
        // Рисуем текущий круг
        context2.beginPath();
        context2.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
        context2.fillStyle = "rgb(172, 138, 180)";
        context2.strokeStyle = "black";
        context2.fill();
        context2.stroke(); 
    }
}
function drawCText(item) {
    console.log(item);
        context2.beginPath();
        context2.textAlign = "center"
        context2.fillStyle = "black";
        context2.strokeStyle = "black";
        context2.font = "26px Genshin Impact";
        context2.fillText(item.id, item.x,  item.y+(item.radius/2));
        context2.fill();
        context2.stroke(); 
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Point {
    constructor(id, x, y, pher, dist) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.pher = pher;
        this.dist = dist;
    }
} 

class Way {
    constructor(way, dist) {
        this.way = way;
        this.dist = dist;
    }
}

class Probability {
    constructor(probability, index) {
        this.probability = probability;
        this.index = index;
    }
}

function erase() {
    clear(context1);
    clear(context2);
    points = [];
    circles = [];
    id = 0;
    let table = document.querySelector('table');
    document.querySelector('.thead').style.display  = 'none';
    table.parentNode.removeChild(table);
}

let points = []; //хранение данных для каждой вершины

// ОСНОВНОЙ АЛГОРИТМ
async function antAlgorithm() {
    // let tempWay = [];
    let antCount = circles.length;
    fillingPoints();
    let repeat = 0;
    let minWay;
    // let copy;
    while(repeat <= circles.length * circles.length) {
        // let last = 0;
        let ways = []; //хранение путей с расстоянием
        for(let i = 0; i < antCount; i++) {
            // if(last == circles.length) {
            //     last = 0;
            // }
            let way = [];
            let index = i;
            way.push(points[index])
            while(way.length != circles.length) {
                let probability = probabilityPoints(way, index);
                let choice = choicePoint(probability);
                index = choice;
                way.push(points[choice]);
            }
            way.push(way[0]);
            let temp = new Way(way, distance(way));
            if(minWay == undefined || temp.dist < minWay.dist) {
                minWay = temp;
                await new Promise((resolve, reject) => setTimeout(resolve, 200));
                clear(context1);
                // await new Promise((resolve, reject) => setTimeout(resolve, 100));
                drawLine(minWay);
            }
            // last += 1;
            ways.push(temp);
            // copy = ways.slice();
        }
        changePheromone(ways);
        ways = [];
        repeat+=1;
    }
    let outputFitness = [];
    let outputId = [];
    let temp = minWay.way.slice(minWay.way.findIndex(i => i == points[0]));
    for(let i = 1; i <= minWay.way.findIndex(i => i == points[0]); i++) {
        temp.push(minWay.way[i]);
    }
    console.log(temp);
    outputId = temp;
    outputFitness = minWay.dist;
    clear(context1);
    drawLine(minWay);
    // console.log(tempWay[outputMinIndex(tempWay)].dist);
    //вывод
    let result = [];
    for (let i=0; i<outputId.length; i++){
        result.push(outputId.map(elem => elem.id).join(" "));
    }
    let floorFitness = Math.round(outputFitness);
    let arr =[]
    arr=result.map((x, i) => ({ result: result[i], floorFitness: floorFitness }))
    console.table(result.map((x, i) => ({ result: result[i], floorFitness: floorFitness })))

    let table = document.createElement('table');
    let tbody = document.createElement('tbody');
    table.appendChild(tbody);
    document.getElementById('output').appendChild(table);
    document.querySelector('.thead').style.display  = 'block';
    // for (let ind of arr)  {

        let tr = document.createElement('tr');

        // let td1 = document.createElement('td');
        // // td1.innerHTML = arr.indexOf(ind)+1;
        // tr.appendChild(td1);

        let td2 = document.createElement('td');
        td2.innerHTML = result[0];
        tr.appendChild(td2);
    
        let td3 = document.createElement('td');
        td3.innerHTML = floorFitness;
        tr.appendChild(td3);

        tbody.appendChild(tr);
    // }
}

function distCheck(array, way) {
    for(let i = 0; i < array.length; i++) {
        if(array[i].dist == way.dist) {
            return false;
        }
    }
    // if (array.length > 0 && array[outputMinIndex(array)].dist > way.dist) {
    //     return  true;
    // }
    return true;
}

async function drawLine(way) {
    for(let i = 0; i < way.way.length - 1; i++) {   
        let x0 = way.way[i].x;
        let y0 = way.way[i].y;
        let x1 = way.way[i + 1].x;
        let y1 = way.way[i + 1].y;
        // Рисуем линии
        context1.beginPath();
        context1.moveTo(x0, y0); 
        context1.lineTo(x1, y1);
        context1.lineWidth = 3;         // толщина
        context1.strokeStyle = 'black'; // цвет
        context1.fill();
        context1.stroke(); 
    }
}

async function clear(ctx) {
    ctx.clearRect(0, 0, 900, 700);
}

function check() {
    let way = [];
    let index = 0;
    // console.log(points);
    way.push(points[index]);
    while(way.length != circles.length) {
        let probability = probabilityPoints(way, index);
        let choice = choicePoint(probability);
        index = choice;
        way.push(points[choice]);
    }
    way.push(way[0]);
    let result = new Way(way, distance(way));
    return result;
}

//тоже бесполезно но на всякий
function outputMinIndex(ways) {
    let min = 9999999;
    let index;
    for(let i = 0; i < ways.length; i++) {
        if(ways[i].dist < min) {
            min = ways[i].dist;
            index = i;
        }
    }
    return index;
}

//бесползено но удалять не буду на всякий
function countRepeat(ways) {
    let repeat = 0;
    let min = 999999;
    for(let i = 0; i < ways.length; i++) {
        if(ways[i].dist < min) {
            min = ways[i].dist;
        }
    }
    for(let i = 0; i < ways.length; i++) {
        if(ways[i].dist == min) {
            repeat += 1;
        }
    }
    return repeat;
}

//меняем кол-во феромонов
function changePheromone(ways) {
    let Q = 70; //константа для расстояния
    let p = 0.64; //коэф испарения
    let i = 0;
    //испарение
    while (i < points.length) {
        for(let j = 0; j < points[i].pher.length; j++) {
            let tmp = points[i].pher[j] * p;
            points[i].pher[j] = tmp;
        }
        i++;
    }
    //добавление на пути где ходили муравьишки
    for(let i = 0; i < ways.length; i++) {
        let pheromone = Q / ways[i].dist;
        for(let j = 0; j < ways[i].way.length - 1; j++) {
            let index = ways[i].way[j].id - 1;
            let index1 = ways[i].way[j + 1].id - 1;
            points[index].pher[index1] += pheromone;
            points[index1].pher[index] += pheromone;
        }
    }
}

//выбор вершины 
function choicePoint(probability) {
    let random = Math.random();
    let check = 0;
    for(let i = 0; i < probability.length; i++) {
        check += probability[i].probability;
        if(check >= random) {
            return probability[i].index -  1;
        }
    }
}

//подсчет вероятности перейти в след вершину
function probabilityPoints(way, start) {
    let sumProbability = 0;
    let array = [];
    for(let i = 0; i < circles.length; i++) {
        if(way.includes(points[i]) || i == start) {
            continue;
        }
        let tmp = new Probability(Math.pow(points[start].dist[i], 2) * Math.pow(points[start].pher[i], 1), i + 1);
        sumProbability += tmp.probability;
        array.push(tmp);
    }
    for(let i = 0; i < array.length; i++) {
        array[i].probability = array[i].probability / sumProbability;
    }
    return array;
}

//начальное заполнение массива вершин
function fillingPoints() {
    let temp1 = [];
    
    for(let j = 0; j < circles.length; j++) {
        let temp = [];
        for (let i = 0; i < circles.length; i++) {
        temp[i] = 0.02;
        }
        temp1 = distanceTwo(circles[j]);
        let point = new Point(circles[j].id, circles[j].x, circles[j].y, temp, temp1);
        points.push(point);
    }
}

//вычисление расстояния от одной точки до всех остальных
function distanceTwo(point) {
    let distance = [];
    for(let i = 0; i < circles.length; i++) {
        xDist = Math.abs(point.x - circles[i].x);
        yDist = Math.abs(point.y - circles[i].y);
        distance.push(200/(Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))));
    }
    return distance;
}

//нахождение дистанции
function distance(way) {
    let resultDistance = 0;
    //расстояние от точки до точки
    for (let i = 0; i < way.length - 1; i++) { 
        let xDist;
        let yDist;
        let Dist;
        xDist = Math.abs(way[i].x - way[i + 1].x);
        yDist = Math.abs(way[i].y - way[i + 1].y);
        Dist = Math.sqrt((Math.pow(xDist, 2)) + (Math.pow(yDist, 2)));
        resultDistance += Dist;
    }
    return resultDistance;
}