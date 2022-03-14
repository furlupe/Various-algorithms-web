function createWall() {
    var cell = event.target;
    cell.dataset.isWall = (cell.dataset.isWall === "wall") ? "empty" : "wall";
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

    for (var column = 0; column < size; column++) { // заполнить таблицу n рядами и ячейками
        r = table.insertRow(column);

        for (var row = 0; row < size; row++) {
            cell = r.insertCell(row);

            cell.dataset.isWall = "empty"; // тип клетки - стена\поле
            cell.dataset.x = column; // координата x
            cell.dataset.y = row; // координата y

            cell.height = 10;
            cell.width = 10;

        }
    }

    table.addEventListener("click", createWall)
    document.body.appendChild(table);
}

