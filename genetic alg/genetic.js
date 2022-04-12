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
        context2.fillStyle = "pink";
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Way {
    constructor(way, dist) {
        this.way = way;
        this.dist = dist;
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

async function geneticAlgorithm(){
    let generations = []; //массив где будут храниться все наши поколения
    let countElement = circles.length; //генерация оптимального(нет) кол-ва предков
     //генерация первого поколения 
     let i = 0;
     while(i < countElement) {
        let tempWay = firstGeneration();
        let temp = new Way(tempWay, distance(tempWay));
        if(!generations.includes(temp)){
            generations.push(temp);
            i++;
        }
    }
    let outputFitness = [];
    let outputId = [];

    if(circles.length <= 3) {
        outputId.push(generations[0].way);
        outputFitness.push(generations[0].dist);
    }
    let countRepeat = 0;
    let preMinWay;

    while(countRepeat <= circles.length * circles.length * circles.length) {
        crossover(generations);
        let minWay = new Way(generations[outputMinIndex(generations, 0)].way, generations[outputMinIndex(generations, 0)].dist);
        if(preMinWay == undefined || preMinWay.dist > minWay.dist) {
            outputId.push(minWay.way);
            outputFitness.push(minWay.dist);
            if(preMinWay != undefined){
                let table = document.querySelector('table');
                document.querySelector('.thead').style.display  = 'none';
                table.parentNode.removeChild(table);
            }
            preMinWay = minWay;
            output(minWay, false);
            await new Promise((resolve, reject) => setTimeout(resolve, 200));
            clear(context1);
            // await new Promise((resolve, reject) => setTimeout(resolve, 100));
            drawLine(outputId[outputId.length - 1]);
            countRepeat = 0;
        }
        else{
            countRepeat+=1;
        }
    } 
    let table = document.querySelector('table');
    document.querySelector('.thead').style.display  = 'none';
    table.parentNode.removeChild(table);
    output(preMinWay, true);
}
function output(way, flag) {
    let result = [];
    for (let i=0; i<way.way.length; i++){
        result.push(way.way.map(elem => elem.id).join(" "));
    }
    // let floorFitness = [];
    // for(let i = 0; i < way.dist.length; i++) {
    let floorFitness = Math.round(way.dist);
    // }
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
        // td1.innerHTML = arr.indexOf(ind)+1;
        // tr.appendChild(td1);

        let td2 = document.createElement('td');
        td2.innerHTML = result[0];
        if(flag == true) {
            td2.innerHTML = 'WIN ' + result[0];
        }
        tr.appendChild(td2);
    
        let td3 = document.createElement('td');
        td3.innerHTML = floorFitness;
        tr.appendChild(td3);

        tbody.appendChild(tr);
}

async function drawLine(way) {
    for(let i = 0; i < way.length - 1; i++) {   
        let x0 = way[i].x;
        let y0 = way[i].y;
        let x1 = way[i + 1].x;
        let y1 = way[i + 1].y;
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

//генерация первого поколения
function firstGeneration () {
    let editChromosome = [];
    editChromosome = circles.slice();
    editChromosome.shift();
    shuffle(editChromosome);
    editChromosome.push(circles[0]);
    editChromosome.unshift(circles[0]);
    return editChromosome;
}

//кроссинговер или скрещивание
function crossover(generations) {

    //рандомный выбор родителей
    let ancestor1 = generations[getRandomInt(0, generations.length - 1)].way;
    let ancestor2 = generations[getRandomInt(0, generations.length - 1)].way;
    while(ancestor1 == ancestor2) {
        ancestor2 = generations[getRandomInt(0, generations.length - 1)].way;
    }

    //заполняем геном
    let child1 = fillingGenes(ancestor1, ancestor2); 
    let child2 = fillingGenes(ancestor2, ancestor1);
    while(child1 == child2) {
        child2 = fillingGenes(ancestor2, ancestor1);
        // || child2 == ancestor1 || child2 == ancestor2
    }
    // while(child1 == child2) {
    //     child1 = fillingGenes(ancestor1, ancestor2);
    //     //  || child1 == ancestor1 || child1 == ancestor2
    //     // distance(child2) <= Math.min(distance(ancestor1), distance(ancestor2))
    // }
    //вычисляем длины путей
    //добавляем потомков в наше поколение, добавляем длины путей(фитнесс)
    let temp1 = new Way(child1, distance(child1));
    let temp2 = new Way(child2, distance(child2));
    generations.push(temp1);
    generations.push(temp2);
    //находим 2 наихудшие хромомсомы
    let indexMax = outputMinIndex(generations, generations.length - 1);
    let indexPreMax = outputMinIndex(generations, generations.length - 2);
    if(indexMax == indexPreMax) {
        let copy = [];
        for(let i = 0; i < generations.length; i++) {
            copy.push(generations[i].dist);
        }
        copy.sort(function(a, b) {
            return a - b;
        });
        for(let i = 0; i < generations.length; i++) {
            if(generations[i].dist == copy[generations.length - 2] && i != indexMax) {
            indexPreMax = i;
            break;
            }
        }
    }
    //удаляем их из поколения и фитнессов(они сдохли для нас)
    generations.splice(Math.max(indexMax, indexPreMax), 1);
    generations.splice(Math.min(indexPreMax, indexMax), 1);
}

//заполняем геном
function fillingGenes(ancestor1, ancestor2) {
    //выбирая точку разрыва заполняем первый сектор генами родителей
    let averageGenes = getRandomInt(1, ancestor1.length - 2);
    let child = ancestor1.slice(0, averageGenes + 1);
    let i = averageGenes;
    //заполняем гены потомков генами противополжных родителей после точки разрыва
    while(i < ancestor2.length) {
        if(!child.includes(ancestor2[i])){
            child.push(ancestor2[i]);
        }
        i++;
    }
    //если хромомсома потомка заполнена не до конца, заполняем генами начального родителя после точки разрыва
    i = averageGenes; 
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
    let mutationPercentage1 = 40;
    let mutationPercentage2 = 50;
    let number = getRandomInt(0, 100);
    
    let index1 = getRandomInt(1, child.length - 2);
    let index2 = getRandomInt(1, child.length - 2);
    while (index1 == index2) {
        index2 = getRandomInt(1, child.length - 2);
    }
    //выполянем ее сменой двух любых генов
    if(number < mutationPercentage1) {
        child = swap(child, index1, index2);
    }
    //генерируем начало и конец реверса
    index1 = getRandomInt(1, child.length - 2);
    index2 = getRandomInt(1, child.length - 2);
    while (index1 == index2) {
        index2 = getRandomInt(1, child.length - 2);
    }
    if(index2 < index1) {
        let t = index2;
        index2 = index1;
        index1 = t;
    }
    //делаем реверс куска
    if(number < mutationPercentage2) {
        let j = index2;
        let copy = child.slice();
        for(let i = index1; i < (index1 + index2) / 2; i++) {
            child[i] = copy[j];
            child[j] = copy[i];
            j--;
        }
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

//среднее значение фитнесса
function averageFitness(generations) {
    let sumDist = 0;
    let tmp = [];
    for(let i = 0; i < generations.length; i++) {
        tmp.push(generations[i].dist);
    }
    for(let i = 0; i < tmp.length; i++) {
        sumDist += tmp[i];
    }
    return sumDist / tmp.length;
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

//ищем минимальный путь а вернее его индекс
function outputMinIndex(array, index) {
    let tmp = [];
    for(let i = 0; i < array.length; i++) {
        tmp.push(array[i].dist);
    }
    tmp.sort(function(a, b) {
        return a - b;
    });
    for(let i = 0; i < array.length; i++) {
        if(array[i].dist == tmp[index]) {
            minIndex = i;
            break;
        }
    }
    return minIndex;
}

//число повторов в массиве
function countRepeat(array, value) {
    let count = 0;
    for(let i = 0; i < array.length; i++){
        if(array[i] == value) {
            count ++;
        }
    }
    return count;
}

