const matrix = new Array();
document.getElementById("acceptChangesButton").style.display = 'none';
document.getElementById("makeChangesButton").style.display = 'none';
document.getElementById("pathSearchButton").style.display = 'none';
document.getElementById("pathChangeButton").style.display = 'none';

// класс узла для А*
class Node {
    parent = null;
    x = 0;
    y = 0;
    g = 0;
    h = 0;
    f = 0;
}

// класс точки
class Point {
    x = null;
    y = null;
    inUse = 0;
}

// ничего делать n миллисекунд
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function isInside(x, y, size) {
    return (x >= 0 && y >= 0 && x < size && y < size);
}

// возвращает случайное целое число в диапазоне [min; max)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min;
}

// генерация лабиринта через алгоритм Прима
function primmLabyrinth() {

    // находится ли координата (x, y) внутри диапазона
    var size = document.getElementById('labSize').value;

    // создать точку с координатами (x, y)
    function createPoint(x, y) {
        var p = new Point();
        p.x = x;
        p.y = y;

        return p;
    }

    // добавить пустое поле
    function makeEmpty(x, y) {
        matrix[x][y] = 0;
        document.getElementById('lab').rows[x].cells[y].dataset.mode = "empty";
    }

    // превращаем все ячейки в стены
    matrix.length = 0;
    for (var i = 0; i < size; i++) {
        matrix[i] = new Array();
        for (var j = 0; j < size; j++) {
            matrix[i][j] = 1;
            document.getElementById('lab').rows[i].cells[j].dataset.mode = "wall";
        }
    }

    var cell = createPoint(getRandomInt(0, size), getRandomInt(0, size)); // случайная точка для начала построения

    makeEmpty(cell.x, cell.y); // делаем ее пустой

    var newFields = new Array();

    // находим соседей этой точки
    if (isInside(cell.x + 2, cell.y, size))
        newFields.push(createPoint(cell.x + 2, cell.y));

    if (isInside(cell.x - 2, cell.y, size))
        newFields.push(createPoint(cell.x - 2, cell.y))

    if (isInside(cell.x, cell.y + 2, size))
        newFields.push(createPoint(cell.x, cell.y + 2))

    if (isInside(cell.x, cell.y - 2, size))
        newFields.push(createPoint(cell.x, cell.y - 2))

    // пока есть соседи...
    while (newFields.length > 0) {
        // случайная соседняя точка
        var index = getRandomInt(0, newFields.length);
        var x = newFields[index].x;
        var y = newFields[index].y;

        makeEmpty(x, y);
        newFields.splice(index, 1);

        // направления движения
        var directions = new Array([2, 0], [-2, 0], [0, 2], [0, -2])
        while (directions.length > 0) {
            var dirIndex = getRandomInt(0, directions.length);
            var dir = directions[dirIndex];

            if (isInside(x + dir[0], y + dir[1], size)) {

                if (matrix[x + dir[0]][y + dir[1]] === 0) {
                    var deltaX = (-1)**(dir[0] > 0); // прибавление по иксу: если мы шли вправо, то сдвиг влево и наоборот
                    var deltaY = (-1)**(dir[1] > 0); // прибавление по игреку аналогично с иксом

                    if (dir[0] != 0) {
                        matrix[x + dir[0] + deltaX][y] = 0;
                        makeEmpty(x + dir[0] + deltaX, y);
                    }
                    if (dir[1] != 0) {
                        matrix[x][y + dir[1] + deltaY] = 0;
                        makeEmpty(x, y + dir[1] + deltaY);
                    }

                    break;
                }
            }

            directions.splice(dirIndex, 1);
        }

        // ищем соседей соседа
        if (isInside(x + 2, y, size) && matrix[x + 2][y] === 1) {
            newFields.push(createPoint(x + 2, y));
        }

        if (isInside(x - 2, y, size) && matrix[x - 2][y] === 1) {
            newFields.push(createPoint(x - 2, y));
        }

        if (isInside(x, y + 2, size) && matrix[x][y + 2] === 1) {
            newFields.push(createPoint(x, y + 2));
        }

        if (isInside(x, y - 2, size) && matrix[x][y - 2] === 1) {
            newFields.push(createPoint(x, y - 2));
        }
    }

}

// создать стену на нажатой ячейке
function createWall() {
    var cell = event.target;
    var x = cell.dataset.x, y = cell.dataset.y;

    cell.dataset.mode = (cell.dataset.mode === "wall") ? "empty" : "wall";
    matrix[x][y] = (matrix[x][y] === 1) ? 0 : 1;
}

// точки начала пути и его конца
var start = new Point(), finish = new Point();
function createTargets() {
    var cell = event.target;
    if (start.inUse === 1 && finish.inUse === 1)
        return;

    if (cell.dataset.mode === "empty"){
        if (start.inUse === 0) {
            cell.dataset.mode = "start";
            start.x = Number(cell.dataset.y);
            start.y = Number(cell.dataset.x);
            start.inUse = 1;
        } else {
            cell.dataset.mode = "finish";
            finish.x = Number(cell.dataset.y);
            finish.y = Number(cell.dataset.x);
            finish.inUse = 1;

            document.getElementById("pathSearchButton").style.display = '';
            document.getElementById("pathChangeButton").style.display = '';
        }
    }
}

// очистить старт и финиш
function clearTargets() {

    if (start.inUse === 1) {
        var st = document.getElementById("lab").rows[start.y].cells[start.x];

        start.x = null;
        start.y = null;
        start.inUse = 0;

        st.dataset.mode = "empty";
    }

    if (finish.inUse === 1) {
        var fn = document.getElementById("lab").rows[finish.y].cells[finish.x];

        finish.x = null;
        finish.y = null;
        finish.inUse = 0;

        fn.dataset.mode = "empty";
    }

    let size = document.getElementById('labSize').value;

    // перекрасить клетки, которые были рассмотрены в процессе поиска пути
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let cell = document.getElementById("lab").rows[j].cells[i];
            cell.dataset.mode = (cell.dataset.mode == "path") ? "empty" : cell.dataset.mode;
        }
    }

    document.getElementById("pathSearchButton").style.display = 'none';
    document.getElementById("pathChangeButton").style.display = 'none';
}

// функция создает таблицу n*n
function createTable(){

    // удалить уже существующую до этого таблицу
    var table = document.getElementById('lab');
    if (table !== null)
        table.remove();

    table = document.createElement("table"); // создать новую таблицу
    table.id = 'lab';
    table.border = 1;

    var r, cell; // переменные для рядов и ячеек
    var size = document.getElementById('labSize').value, maxSize = document.getElementById("labSize").max; // размерность таблицы

    if (size < 2) size = 2;

    size = Math.min(maxSize, size);
    document.getElementById("labSize").value = size;

    matrix.length = 0; // очищаем таблицу
    for (var column = 0; column < size; column++) { // заполнить таблицу n рядами и ячейками
        r = table.insertRow(column);
        matrix[column] = new Array();

        for (var row = 0; row < size; row++) {
            cell = r.insertCell(row);

            cell.dataset.mode = "empty"; // тип клетки - стена\поле
            cell.dataset.x = column; // координата x
            cell.dataset.y = row; // координата y

            cell.height = 20;
            cell.width = 20;

            matrix[column][row] = 0;
        }
    }

    table.addEventListener("click", createWall)
    document.body.appendChild(table);

    document.getElementById("acceptChangesButton").style.display = "";
}

// принять созданный лабиринт
function acceptChanges() {
    // сделать неактивными ввод размерности матрицы, кнопки ее создания и кнопки создания лабиринта
    document.getElementById("labSize").disabled = true;
    document.getElementById("primmButton").disabled = true;

    var table = document.getElementById("lab");
    table.removeEventListener("click", createWall); // перестать делать стены по нажатию на ячейку
    table.addEventListener("click", createTargets); // начать ставить цели

    document.getElementById("acceptChangesButton").style.display = "none"; // скрыть кнопку ПРИМЕНИТЬ
    document.getElementById("makeChangesButton").style.display = ""; // отобразить кнопку ИЗМЕНИТЬ

}

// действия, обратные acceptChanges()
function makeChanges() {
    let size = document.getElementById('labSize').value;

    document.getElementById("labSize").disabled = false;
    document.getElementById("primmButton").disabled = false;

    var table = document.getElementById("lab");
    table.removeEventListener("click", createTargets); // перестать делать цели по нажатию на ячейку
    table.addEventListener("click", createWall); // начать ставить стены

    document.getElementById("acceptChangesButton").style.display = "";
    document.getElementById("makeChangesButton").style.display = "none";

    clearTargets();
}

// A*
async function aStar(){

    // эвристика для алгоритма - Манхэттен
    function heuristic(v, end) {
        return Math.abs(v.x - end.x) + Math.abs(v.y - end.y)
    }
    // критерий сравнения двух узлов по f для сортировки
    function compare(a, b) {
        if (a.f < b.f)
            return -1;
        if (a.f > b.f)
            return 1;
        else
            return 0;
    }

    var size = document.getElementById('labSize').value; // размерность таблицы

    var stNode = new Node();
    stNode.x = Number(start.x);
    stNode.y = Number(start.y);

    var openList = []; // список точек, подлежащих проверке
    openList.push(stNode)

    var closedList = []; // список уже проверенных точек

    var current = new Node();

    while (openList.length > 0) {
        openList.sort(compare); // отсортировать список доступных узлов в порядке убывания

        current = openList[0]; // взять в качестве текущего узла узел с min g
        await sleep(75);
        if (!(current.x == start.x && current.y == start.y) && !(current.x == finish.x && current.y == finish.y)) {
            document.getElementById("lab").rows[current.y].cells[current.x].dataset.mode = "checking";
        }

        // если текущий узел = конечный, то выход
        if (current.x === finish.x && current.y === finish.y) {
            break;
        }

        openList.splice(openList.indexOf(current), 1);
        closedList.push(current);

        let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (var dir of directions) {
            var new_neighbour = new Node();
            new_neighbour.x = current.x + dir[0];
            new_neighbour.y = current.y + dir[1];

            // проверка наличия соседа узла в списке закрытых узлов
            var isClosed = closedList.find(el => (el.x === new_neighbour.x && el.y === new_neighbour.y));

            // проверка наличия соседа узла в списке доступных узлов
            var neighbour = openList.find(el => (el.x === new_neighbour.x && el.y === new_neighbour.y));

            // если сосед находится внутри поля, и не является стеной
            if (isInside(new_neighbour.x, new_neighbour.y, size) && matrix[new_neighbour.y][new_neighbour.x] === 0 && isClosed == null) {
                // если соседа не было в списке открытых узлов, то добавить его
                if (neighbour == null && typeof neighbour === "undefined") {

                    new_neighbour.g = current.g + 1;
                    new_neighbour.h = heuristic(new_neighbour, finish);
                    new_neighbour.f = new_neighbour.g + new_neighbour.h;

                    new_neighbour.parent = current; // откуда попали в соседа, из текущего узла
                    openList.push(new_neighbour);

                    //console.log(new_neighbour);
                }
                // иначе просто обновить предка соседа и его g
                else {
                    if (neighbour.g >= current.g + 1) {
                        openList[openList.indexOf(neighbour)].g = current.g + 1;
                        openList[openList.indexOf(neighbour)].parent = current;
                    }
                }

            }
        }
    }

    // если не был найден путь, вывести соответствующее сообщение
    if (!(current.x == finish.x && current.y == finish.y)) {
        alert(`There is no way to get from (${start.x + 1}, ${start.y + 1}) to (${finish.x + 1}, ${finish.y + 1})`);
    } else {
        // закрасить путь
        for(;current.parent != null; current = current.parent) {
            await sleep(100);
            if (!(current.x == finish.x && current.y == finish.y))
                document.getElementById("lab").rows[current.y].cells[current.x].dataset.mode = "path"
        }
    }
    // перекрасить клетки, которые были рассмотрены в процессе поиска пути (кроме самого пути)
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let cell = document.getElementById("lab").rows[j].cells[i];
            cell.dataset.mode = (cell.dataset.mode == "checking") ? "empty" : cell.dataset.mode;
        }
    }
}