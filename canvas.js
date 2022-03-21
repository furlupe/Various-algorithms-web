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
let allChromosome = [];
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
        return 0;
    }
    allChromosome = generations.slice();
    let outputFitness = [];
    let outputId = [];
    let tri = 0;
    let countRepeat = 0;
    let fl = false;
    while(tri < 900) {
        crossover(generations, fitness);
        tri++;    
        if(!outputFitness.includes(fitness[outputMinIndex(fitness, 0)])) {
            outputFitness.push(fitness[outputMinIndex(fitness, 0)]);
            fl = true;
        }
        if(!outputId.includes(generations[outputMinIndex(fitness, 0)]) && fl == true) {
            outputId.push(generations[outputMinIndex(fitness, 0)]);
        }
        if(fl == false) {
            countRepeat ++;
        }
        fl = false;
        // console.log(fitness.length);
        // console.log(generations.length);
        console.log(fitness[outputMinIndex(fitness,0)]);
        // for(let i = 0; i < generations[outputMinIndex(fitness, 0)].length - 1; i++) {
        //     console.log(generations[outputMinIndex(fitness, 0)][i].id);
        // }
        // let element = document.querySelector('.outputFitness');
        // element.innerHTML = outputMinIndex(fitness, 0);
        // let elementArray = document.querySelector('.outputId');
        // console.log(generations[outputMinIndex(fitness,0)]);
        // elementArray.innerHTML = generations[outputMinIndex(fitness, 0)].id;
        // console.log(outputId);
        // console.log(outputMinIndex(fitness, 0));
        // console.log(outputFitness);
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
function crossover(generations, fitness) {
    // console.log(generations);
    

    // рандомно выбираем родителей
    let indexBest1 = outputMinIndex(fitness, 0);
    let indexBest2 = outputMinIndex(fitness, 1);
    if(indexBest2 == indexBest1) {
        let copy = fitness.slice();
        copy.sort(function(a, b) {
            return a - b;
        });
        for(let i = 0; i < fitness.length; i++) {
            if(fitness[i] == copy[1] && i != indexBest1) {
            indexBest2 = i;
            break;
            }
        }
    }
    let ancestor1 = generations[indexBest1];
    let ancestor2 = generations[indexBest2];
    
    // while(ancestor1 == ancestor2) {
    //     ancestor2 = generations[getRandomInt(0, generations.length - 1)];
    // }
    //заполняем геном
    let child1 = fillingGenes(ancestor1, ancestor2); 
    let child2 = fillingGenes(ancestor2, ancestor1);
    while(child1 == child2 || child2 == ancestor1 || child2 == ancestor2 || allChromosome.includes(child2)) {
        child2 = fillingGenes(ancestor2, ancestor1);
    }
    while(child1 == child2 || child1 == ancestor1 || child1 == ancestor2 || allChromosome.includes(child1)) {
        child1 = fillingGenes(ancestor1, ancestor2);
    }
    allChromosome.push(child1);
    allChromosome.push(child2);
    //находим 2 наихудших хромомсомы
    let indexMax = outputMinIndex(fitness, fitness.length - 1);
    let indexPreMax = outputMinIndex(fitness, fitness.length - 2);
    if(indexMax == indexPreMax) {
        let copy = fitness.slice();
        copy.sort(function(a, b) {
            return a - b;
        });
        for(let i = 0; i < fitness.length; i++) {
            if(fitness[i] == copy[fitness.length - 2] && i != indexMax) {
            indexPreMax = i;
            break;
            }
        }
    }
    //вычисляем длины путей
    //добавляем потомков в наше поколение, добавляем длины путей(фитнесс)
    fitness.push(distance(child1));
    fitness.push(distance(child2));
    generations.push(child1);
    generations.push(child2);
    
    //удаляем их из поколения и фитнессов(они сдохли для нас)
    fitness.splice(indexMax, 1);
    fitness.splice(indexPreMax, 1);
    generations.splice(indexMax, 1);
    generations.splice(indexPreMax, 1);
}

//заполняем геном
function fillingGenes(ancestor1, ancestor2) {
    //выбирая точку разрыва заполняем первый сектор генами родителей
    let averageGenes = numberOfGenes(ancestor1.length - 2);
    let child = ancestor1.slice(0, (((ancestor1.length - 2) - averageGenes) / 2) + 1);
    let i = ((ancestor2.length - 2) - averageGenes) / 2 + 1;
    //заполняем гены потомков генами противополжных родителей после точки разрыва
    while(i < ancestor2.length) {
        if(!child.includes(ancestor2[i])){
            child.push(ancestor2[i]);
        }
        i++;
    }
    //если хромомсома потомка заполнена не до конца, заполняем генами начального родителя после точки разрыва
    i = ((ancestor2.length - 2) - averageGenes) / 2 + 1;
    if(child.length != ancestor1.length - 1) {
        while(i < ancestor1.length) {
            if(!child.includes(ancestor1[i])){
            child.push(ancestor1[i]);
            }
            i++;
        }
    }
    //вставляем конец(из начала)
    child.push(child[0]);
    child = mutation(child);
    return child;
}

//мутация
function mutation(child) {
    //генерируем число для процентажа мутаций
    let mutationPercentage = 30;
    let number = getRandomInt(0, 100);
    //выполянем ее сменой двух любых генов
    if(number < mutationPercentage) {
        child = swap(child, getRandomInt(1, child.length - 2), getRandomInt(1, child.length - 2));
    }
    return child;
}

//нахождение дистанции(фитнесса)
function distance(chromosome) {
    let resultDistance = 0;
    //расстояние от точки до точки
    for (let i = 0; i < chromosome.length - 1; i++) { 
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

//нахождение оптимального(нет) кол-ва хромосом
function numberOfelement(length) {
    let fact = 1;
    if(length <= 3) {
        return 3;
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
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
  }

//выбор кол-ва генов для кроссинговера
function numberOfGenes(lengthOfChromosome) {
    if(lengthOfChromosome % 3 == 0) {
        return lengthOfChromosome / 3;
    }
    else if(lengthOfChromosome % 3 == 1) {
        return ((lengthOfChromosome - 1) / 3) + 1;
    }
    else return ((lengthOfChromosome - 2) / 3) + 2;
}

//меняем местами элементы
function swap(array, i, j) {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    return array;
}

function outputMinIndex(array, index) {
    let copy = array.slice();
    let minIndex;  
    copy.sort(function(a, b) {
        return a - b;
    });
    for(let i = 0; i < array.length; i++) {
        if(array[i] == copy[index]) {
            minIndex = i;
            break;
        }
    }
    return minIndex;
}

// function checkChild(ancestor1, ancestor2, child1, child2) {
//     if(ancestor1 == child1 || ancestor2 == child1) {
//         return 1;
//     }
//     else if (ancestor1 == child2 || ancestor2 == child2) {
//         return 2;
//     }
//     else if (child1 == child2) {
//         return 1;
//     }
//     else {
//         return 0;
//     }
// }
