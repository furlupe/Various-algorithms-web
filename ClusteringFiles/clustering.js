dots =[]; //мн-во нарисованных точек
centers=[]; //мн-во нарисованных центров
clusters=[]; //мн-во мн-в кластеров (с центром и набором точек, входящих в кластер)

//рисуем по клику мыши
canvas=document.getElementById("currCanvas");
    ctx=canvas.getContext('2d');

    var mouse = {x:0, y:0}; //позиция курсора
    var pointSize = centerSize = 4; //размер точки и крестика

    canvas.addEventListener("click", e => {
        mouse.x = e.offsetX; //координаты
        mouse.y = e.offsetY; //клика мыши

        ctx.beginPath();
        if (document.getElementById("dot").checked == true){
            dots.push({x:mouse.x, y:mouse.y}); //записываем и рисуем точку

            ctx.arc(mouse.x, mouse.y, pointSize, 0, Math.PI * 2);
            ctx.fillStyle = ctx.strokeStyle = 'black';
        }
        else{
            centers.push({x:mouse.x, y:mouse.y}); //иначе записываем и рисуем крестик

            ctx.moveTo(mouse.x - centerSize, mouse.y - centerSize);
            ctx.lineTo(mouse.x + centerSize, mouse.y + centerSize);
            ctx.moveTo(mouse.x + centerSize, mouse.y - centerSize);
            ctx.lineTo(mouse.x - centerSize, mouse.y + centerSize);
            
            //!цвета для крестиков поправить хорошо бы! но пока что так
            var part = 17;//градусная мера для смены цвета
            let color='hsl('+centers.length*part+', 80%, 50%)';
            ctx.lineWidth=2;
            ctx.fillStyle = ctx.strokeStyle = color;
        }
        ctx.fill();
        ctx.stroke();
    });

//(Евклидово) расстояние от центра кластера до точки
function Distance(dot, center){
    return Math.sqrt((center.x-dot.x)*(center.x-dot.x)+(center.y-dot.y)*(center.y-dot.y))
}

//определение нужного кластера для точки
function GetCluster(dot){
    let minIndex = 0;
    let minDist = Distance(dot, clusters[0].center);
    for (let i = 1; i < clusters.length; i++){
        let currDist = Distance(dot, clusters[i].center)
        if (currDist < minDist){
            minDist = currDist;
            minIndex = i;
        }
    }

    return minIndex;
}

//проверка на обновление положения центров кластеризации
function UpdateCentroids(){
    let isChanged = false;
    for (let i = 0; i < clusters.length; i++){
        let x = 0, y = 0;
        for (let j = 0; j < clusters[i].dots.length; j++){
            x+=clusters[i].dots[j].x;
            y+=clusters[i].dots[j].y;
        }

        x/=clusters[i].dots.length;
        y/=clusters[i].dots.length;

        if (x!=clusters[i].center.x || y!=clusters[i].center.y){
            isChanged = true;
        }

        clusters[i].center.x=x;
        clusters[i].center.y=y;
    }

    return isChanged;
}

function KMeans(){
    alert(centers.length);
}
