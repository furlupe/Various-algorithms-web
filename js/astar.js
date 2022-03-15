const matrix = new Array();
document.getElementById("acceptChangesButton").style.display = 'none';
document.getElementById("makeChangesButton").style.display = 'none';

// класс точки
class Point {
    x;
    y;
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
    function isInside(x, y) {
        return (x >= 0 && y >= 0 && x < size && y < size);
    }

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
    if (isInside(cell.x + 2, cell.y))
        newFields.push(createPoint(cell.x + 2, cell.y));

    if (isInside(cell.x - 2, cell.y))
        newFields.push(createPoint(cell.x - 2, cell.y))

    if (isInside(cell.x, cell.y + 2))
        newFields.push(createPoint(cell.x, cell.y + 2))

    if (isInside(cell.x, cell.y - 2))
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

            if (isInside(x + dir[0], y + dir[1])) {

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
        if (isInside(x + 2, y) && matrix[x + 2][y] === 1) {
            newFields.push(createPoint(x + 2, y));
        }

        if (isInside(x - 2, y) && matrix[x - 2][y] === 1) {
            newFields.push(createPoint(x - 2, y));
        }

        if (isInside(x, y + 2) && matrix[x][y + 2] === 1) {
            newFields.push(createPoint(x, y + 2));
        }

        if (isInside(x, y - 2) && matrix[x][y - 2] === 1) {
            newFields.push(createPoint(x, y - 2));
        }
    }

    console.log(matrix);
}

function createWall() {
    var cell = event.target;
    var x = cell.dataset.x, y = cell.dataset.y;

    cell.dataset.mode = (cell.dataset.mode === "wall") ? "empty" : "wall";
    matrix[x][y] = (matrix[x][y] === 1) ? 0 : 1;
}

function createTarget() {
    var cell = event.target;
    if (cell.dataset.mode === "empty"){
        cell.dataset.mode = "start";
    }
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
    var size = document.getElementById('labSize').value; // размерность таблицы

    matrix.length = 0; // очищаем таблицу
    for (var column = 0; column < size; column++) { // заполнить таблицу n рядами и ячейками
        r = table.insertRow(column);
        matrix[column] = new Array();

        for (var row = 0; row < size; row++) {
            cell = r.insertCell(row);

            cell.dataset.mode = "empty"; // тип клетки - стена\поле
            cell.dataset.x = column; // координата x
            cell.dataset.y = row; // координата y

            cell.height = 10;
            cell.width = 10;

            matrix[column][row] = 0;
        }
    }

    table.addEventListener("click", createWall)
    document.body.appendChild(table);

    document.getElementById("acceptChangesButton").style.display = "";
}

function acceptChanges() {
    // сделать неактивными ввод размерности матрицы, кнопки ее создания и кнопки создания лабиринта
    document.getElementById("labSize").disabled = true;
    document.getElementById("labButton").disabled = true;
    document.getElementById("primmButton").disabled = true;

    var table = document.getElementById("lab");
    table.removeEventListener("click", createWall); // перестать делать стены по нажатию на ячейку
    table.addEventListener("click", createTarget); // начать ставить цели

    document.getElementById("acceptChangesButton").style.display = "none"; // скрыть кнопку ПРИМЕНИТЬ
    document.getElementById("makeChangesButton").style.display = ""; // отобразить кнопку ИЗМЕНИТЬ

}
// действия, обратные acceptChanges()
function makeChanges() {
    document.getElementById("labSize").disabled = false;
    document.getElementById("labButton").disabled = false;
    document.getElementById("primmButton").disabled = false;

    var table = document.getElementById("lab");
    table.removeEventListener("click", createTarget); // перестать делать стены по нажатию на ячейку
    table.addEventListener("click", createWall); // начать ставить цели

    document.getElementById("acceptChangesButton").style.display = "";
    document.getElementById("makeChangesButton").style.display = "none";
}