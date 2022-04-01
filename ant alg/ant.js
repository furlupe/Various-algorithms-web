window.onload = function() {
    // Определение контекста рисования
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");  
    context.beginPath();
    context.rect(0, 0, 900, 700);
    context.fillStyle = "rgba(0, 0, 0, 0)";
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
    let circle = new Circle(x, y, 20, "");
    // Сохраняем его в массиве
    circles.push(circle);
    console.log(circles);
    
   
    if (circles.length >= 2){
        drawLine();
    } 
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
        context.beginPath();
        context.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
        context.fillStyle = "rgb(172, 138, 180)";
        context.strokeStyle = "black";
        context.fill();
        context.stroke(); 
    }
}
function drawCText(item) {
    console.log(item);
        context.beginPath();
        context.textAlign = "center"
        context.fillStyle = "black";
        context.strokeStyle = "black";
        context.font = "26px Genshin Impact";
        context.fillText(item.id, item.x,  item.y+(item.radius/2));
        context.fill();
        context.stroke(); 
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

let points = []; //хранение данных для каждой вершины

// ОСНОВНОЙ АЛГОРИТМ
function antAlgorithm() {
    let antCount = circles.length;
    fillingPoints();
    let last = 0;
    let repeat = 0;
    let copy;
    while(repeat < 1000) {
        let ways = []; //хранение путей с расстоянием
        for(let i = 0; i < antCount; i++) {
            let way = [];
            let index = last;
            way.push(points[index])
            while(way.length != circles.length) {
                let probability = probabilityPoints(way, index);
                let choice = choicePoint(probability);
                index = choice;
                way.push(points[choice]);
            }
            way.push(way[0]);
            let temp = new Way(way, distance(way));
            last = index;
            ways.push(temp);
            copy = ways.slice();
        }
        changePheromone(ways);
        repeat += 1;
        // repeat = countRepeat(ways);
    }
    //последний финальный выигрывающий ключевой прекрасный муравей(представьте что он золотой)
    // let indexMin = outputMinIndex(copy);
    let outputFitness = [];
    let outputId = [];
    let index = 0;
    console.log(points);
    outputId.push(points[index]);
    while(outputId.length != circles.length) {
        let probability = probabilityPoints(outputId, index);
        let choice = choicePoint(probability);
        index = choice;
        outputId.push(points[choice]);
    }
    outputId.push(outputId[0]);
    outputFitness = distance(outputId);
    // console.log(outputId);
    // console.log(outputFitness);

    let result = [];
    for (let i=0; i<outputId.length; i++){
        result.push(outputId.map(elem => elem.id).join(" "));
    }
    let floorFitness = Math.round(outputFitness);
    // console.log(floorFitness);
    // console.log(floorFitness);
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

// function sumArray(array) {
//     let summa = 0;
//     for(let i = 0; i < array.length; i++) {
//         summa += array[i].probability;
//     }
//     return summa;
// }

// function stop() {
//     points
// }

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

function changePheromone(ways) {
    let Q = 70; //константа для расстояния
    let p = 0.64; //коэф испарения
    let i = 0;
    while (i < points.length) {
        for(let j = 0; j < points[i].pher.length; j++) {
            let tmp = points[i].pher[j] * p;
            points[i].pher[j] = tmp;
        }
        i++;
    }
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
            // console.log("rand");
            // console.log(random);
            // console.log("check");
            // console.log(check);
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
        let tmp = new Probability(Math.pow(points[start].dist[i], 4) * Math.pow(points[start].pher[i], 1), i + 1);
        sumProbability += tmp.probability;
        array.push(tmp);
    }
    for(let i = 0; i < array.length; i++) {
        array[i].probability = array[i].probability / sumProbability;
    }
    // console.log(sumProbability);
    // console.log(tmp);
    return array;
}

//начальное заполнение массива вершин
function fillingPoints() {
    let temp1 = [];
    
    for(let j = 0; j < circles.length; j++) {
        let temp = [];
        for (let i = 0; i < circles.length; i++) {
        temp[i] = 0.2;
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
        distance.push(300/(Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))));
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





























// let points = [];
// var antCount = 10;
// function antAlgorithm() {
//     //da hui ego znaet
//     //заполняем массив точек класса point
//     let temp = [];
//     let ways = [];
//     let dist = [];
//     for(let i = 0; i < circles.length; i++) {
//         temp.push(0.200);
//     }
//     for(let i = 0; i < circles.length; i++) {
//         let temp1 = distanceTwo(circles[i]);
//         let point = new Point(circles[i].id, circles[i].x, circles[i].y, temp, temp1);
//         points.push(point);
//     }
//     ///////////////////начало алгоритма
//     let tri = 0;
//     while(tri < 1) {
//         let last = 0;
//         for(let i = 0; i < antCount; i++) {
//             let way = [];
//             let k = last;
//             while(way.length != circles.length) {
//                 if(k == circles.length) {
//                     k = 0;
//                 }

//             }
//             last = way[way.length - 1].id;
//             dist.push(distanceWay(way));
//             ways.push(way);    
//             console.log(ways);
//             console.log(dist);
//         }
//         tri++;
//     }

// }

// //вычисление вероятности пропорц. длине пути и кол-ву феромонов дороги до точки
// function probabilityChoice(start, way) {
//     let array = [];
//     let sumProbability = 0;
//     for(let i = 0; i < points.length; i++) {
//         temp = points[start].pher[i] * points[start].dist[i];
//         if(way.includes(points[i]) || start == i) {
//             continue;
//         }
//         sumProbability += temp;
//         array.push(temp);
//     }
//     array.forEach(function(item) {
//         item /= sumProbability;
//     })
//     return array;
// }

// //добавление феромона
// function fillingPheromone() {
// }

// function fillingWay(start) {
//     let way = [];
//     while(way.length != circles.length) {
//         let probability = probabilityChoice(start, way);
//         let choice = choicePoint(probability);
//         way.push(points[choice])
//     }
// }

// //констнанта деленная на длину до точки (близость) 
// function distanceTwo(point1) {
//     let distance = [];
//     for(let i = 0; i < circles.length; i++) {
//         xDist = Math.abs(point1.x - circles[i].x);
//         yDist = Math.abs(point1.y - circles[i].y);
//         distance.push(200/(Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))));
//     }
//     return distance;
// }
 
// //длина пути
// function distanceWay(way) {
//     let resultDistance = 0;
//     //расстояние от точки до точки
//     for (let i = 0; i < way.length - 1; i++) { 
//         let xDist;
//         let yDist;
//         let Dist;
//         xDist = Math.abs(way[i].x - way[i + 1].x);
//         yDist = Math.abs(way[i].y - way[i + 1].y);
//         Dist = Math.sqrt((Math.pow(xDist, 2)) + (Math.pow(yDist, 2)));
//         resultDistance += Dist;
//     }
//     return resultDistance;
// }
// //рандом
// function getRandomArbitrary(min, max) {
//     return Math.random() * (max - min) + min;
// }

// function choicePoint(probability) {
//     let random = getRandomArbitrary(0, sumArray(probability));
//     let summ = 0;
//     for(let i = 0; i < probability.length; i++) {
//         summ += probability[i];
//         if(summ >= random) {
//             return i;
//         }
//     }
// }

// function sumArray(array) {
//     let summ=0;
//     for(let i = 0; i < array.length; i++) {
//         summ+=array[i];
//     }
//     return summ;
// }