/**************************** K_Means++ *****************************/
function K_Means(canvas){
    this.canvas = canvas;
    this.ctx=canvas.getContext('2d');
    this.dots = [];
    this.clusters = [];
    this.height = canvas.height;
    this.width = canvas.width;
    this.size = 5; //размер точек и центроидов
}
//Добавление точки в массив
K_Means.prototype.AddDot = function(x, y){
    this.dots.push({x:x,y:y});
    this.ClearClusters();
}
//Добавления центроида в массив (кластер)
K_Means.prototype.AddCenter = function(x, y){
    this.ClearClusters();
    this.clusters.push({center:{x:x,y:y}, dots:[]});
}
//Очистка кластера
K_Means.prototype.ClearClusters = function(){
    for (let i = 0; i < this.clusters.length; i++){
        this.clusters[i].dots.length = 0;
    }
}
//Расстояние (разные метрики)
K_Means.prototype.Distance = function(dot, center, distType){
    if (distType == "Euclidian")
        return Math.sqrt((center.x-dot.x)*(center.x-dot.x)+(center.y-dot.y)*(center.y-dot.y));
    if (distType == "Manchattan")
        return Math.abs(center.x-dot.x) + Math.abs(center.y-dot.y);
    if (distType == "Chebichev")
        return Math.max(Math.abs(center.x-dot.x),Math.abs(center.y-dot.y));
}
//K-Means++: поиск индекса кластера для точки
K_Means.prototype.GetClusterIndex = function(dot, distType){
    let minIndex = 0;
    let minDist = this.Distance(dot, this.clusters[0].center, distType);
    for (let i = 1; i < this.clusters.length; i++){
        let currDist = this.Distance(dot, this.clusters[i].center, distType)
        if (currDist < minDist){
            minDist = currDist;
            minIndex = i;
        }
    }
    return minIndex;
}
//K-Means++: проверка на смену центроида для кластера
K_Means.prototype.IsChangedCentroids = function(){
    let isChanged = false;
    for (let i = 0; i < this.clusters.length; i++){
        if (this.clusters[i].dots.length == 0){
            continue;
        }

        let x = 0;
        let y = 0;

        for (let j = 0; j < this.clusters[i].dots.length; j++){
            x+=this.clusters[i].dots[j].x;
            y+=this.clusters[i].dots[j].y;
        }

        x/=this.clusters[i].dots.length;
        y/=this.clusters[i].dots.length;

        if (x!=this.clusters[i].center.x || y!=this.clusters[i].center.y){
            isChanged = true;
        }

        this.clusters[i].center.x=x;
        this.clusters[i].center.y=y;
    }
    return isChanged;
}
//Рисуем кластеры
K_Means.prototype.DrawClusters = function(cluster, color){
    this.ctx.fillStyle = this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    for(let i = 0; i < cluster.dots.length; i++){
        this.ctx.beginPath();
        this.ctx.arc(cluster.dots[i].x, cluster.dots[i].y, this.size, 0, Math.PI*2);
        this.ctx.fill();
    }
    this.ctx.beginPath();
    this.ctx.moveTo(cluster.center.x - this.size, cluster.center.y - this.size);
    this.ctx.lineTo(cluster.center.x + this.size, cluster.center.y + this.size);
    this.ctx.moveTo(cluster.center.x - this.size, cluster.center.y + this.size);
    this.ctx.lineTo(cluster.center.x + this.size, cluster.center.y - this.size);
    this.ctx.stroke();
}
//Рисуем точки
K_Means.prototype.DrawDots = function(){
    for (let i = 0; i < this.dots.length; i++){
        this.ctx.beginPath();
        this.ctx.arc(this.dots[i].x, this.dots[i].y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = ctx.strokeStyle = 'black';
        ctx.fill();
    }
}
//Рисуем
K_Means.prototype.Draw = function(){
    this.ctx.fillStyle='rgba(0, 0, 0, 0)';
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.DrawDots();
    for(let i = 0; i < this.clusters.length; i++){
        console.log(i);
        let part = i*23;
        let color='hsl('+part+', 80%, 50%)';
        this.DrawClusters(this.clusters[i], color);
    }
}
//K-Means++: инициализация центров
K_Means.prototype.InitCenters = function(cnt, distType){
    this.ClearClusters();
    this.clusters.length = 0;
    let idx = Math.floor(Math.random()*this.dots.length);
    this.AddCenter(this.dots[idx].x, this.dots[idx].y);

    for (let k = 1; k < cnt; k++){
        let distRes = [];

        for (let i = 0; i < this.dots.length; i++){
            let distance = [];
            for (let j = 0; j < k; j++){
                distance[j] = this.Distance(this.dots[i], this.clusters[j].center, distType)
            }

            let minDist = distance[0];
            for (let j = 1; j < distance.length; j++){
                minDist = Math.min(distance[j], minDist);
            }

            distRes[i] = minDist;
        }

        let currDist = distRes[0];
        let resInd = 0;
        for (let i = 0; i < distRes.length; i++){
            if (currDist < distRes[i]){
                currDist=distRes[i];
                resInd = i;
            }
        }

        this.AddCenter(this.dots[resInd].x, this.dots[resInd].y);
    }
}
//K-Means++: кластеризация
K_Means.prototype.Clusterize = function(cnt, distType){
    kmeans.InitCenters(cnt, distType);
    do{
        this.ClearClusters();
        for(let i = 0; i < this.dots.length; i++){
            let dot={x:this.dots[i].x, y:this.dots[i].y};
            let index=this.GetClusterIndex(dot, distType);
            this.clusters[index].dots.push(dot);
        }
    }
    while(this.IsChangedCentroids());
}
K_Means.prototype.ClearCanvas = function(){
    this.clusters.length = 0;
    this.dots.length = 0;
    cnt.max = 1;
    cnt.value = 1;
    count = 0;
    this.ctx.clearRect(0, 0, this.width, this.height);
}

/**************************** MeanShift *****************************/
function MeanShift(canvas2){
    this.canvas2 = canvas2;
    this.ctx2=canvas2.getContext('2d');
    this.dots = [];
    this.clusters = [];
    this.height = canvas.height;
    this.width = canvas.width;
    this.size = 5; //размер точек и центроидов
    this.radius = 50; //радиус области
}
//Добавление точки в массив
MeanShift.prototype.AddDot = function(x, y){
    this.dots.push({x:x,y:y});
    this.ClearClusters();
}
//Добавления центроида в массив (кластер)
MeanShift.prototype.AddCenter = function(x, y){
    this.ClearClusters();
    this.clusters.push({center:{x:x,y:y}, dots:[]});
}
//Очистка кластера
MeanShift.prototype.ClearClusters = function(){
    for (let i = 0; i < this.clusters.length; i++){
        this.clusters[i].dots.length = 0;
    }
}
//Расстояние (разные метрики)
MeanShift.prototype.Distance = function(dot, center, distType){
    if (distType == "Euclidian")
        return Math.sqrt((center.x-dot.x)*(center.x-dot.x)+(center.y-dot.y)*(center.y-dot.y));
    if (distType == "Manchattan")
        return Math.abs(center.x-dot.x) + Math.abs(center.y-dot.y);
    if (distType == "Chebichev")
        return Math.max(Math.abs(center.x-dot.x),Math.abs(center.y-dot.y));
}
//Рисуем кластеры
MeanShift.prototype.DrawClusters = function(cluster, color){
    this.ctx2.fillStyle = this.ctx2.strokeStyle = color;
    this.ctx2.lineWidth = 2;
    for(let i = 0; i < cluster.dots.length; i++){
        this.ctx2.beginPath();
        this.ctx2.arc(cluster.dots[i].x, cluster.dots[i].y, this.size, 0, Math.PI*2);
        this.ctx2.fill();
    }
    this.ctx2.beginPath();
    this.ctx2.moveTo(cluster.center.x - this.size, cluster.center.y - this.size);
    this.ctx2.lineTo(cluster.center.x + this.size, cluster.center.y + this.size);
    this.ctx2.moveTo(cluster.center.x - this.size, cluster.center.y + this.size);
    this.ctx2.lineTo(cluster.center.x + this.size, cluster.center.y - this.size);
    this.ctx2.stroke();
}
//Рисуем точки
MeanShift.prototype.DrawDots = function(){
    for (let i = 0; i < this.dots.length; i++){
        this.ctx2.beginPath();
        this.ctx2.arc(this.dots[i].x, this.dots[i].y, this.size, 0, Math.PI * 2);
        this.ctx2.fillStyle = ctx2.strokeStyle = 'black';
        ctx2.fill();
    }
}
//Рисуем
MeanShift.prototype.Draw = function(){
    this.ctx2.fillStyle='rgba(0, 0, 0, 0)';
    this.ctx2.clearRect(0, 0, this.width, this.height);
    this.DrawDots();
    for(let i = 0; i < this.clusters.length; i++){
        let part = i*23;
        let color='hsl('+part+', 80%, 50%)';
        this.DrawClusters(this.clusters[i], color);
    }
}
//MeanShift: найти новый центр (для сдвига)
MeanShift.prototype.GetNewCenter = function(arr){
    let x = 0;
    let y = 0;
    for (let i = 0; i < arr.length; i++){
        x += arr[i].x;
        y += arr[i].y;
    }
    x/=arr.length;
    y/=arr.length;

    return {x: x, y: y};
}
//MeanShift: проверка расположения в границах окна
MeanShift.prototype.IsInBounds = function(center, dot, distType){
    let dist = this.Distance(dot, center, distType);
    if (dist <= this.radius){
        return true;
    }
    else{
        return false;
    }
}
//MeanShift: проверка, есть ли уже в области существующего центра
MeanShift.prototype.IsInClusters = function(center, distType){
    for (let i = 0; i < this.clusters.length; i++){
        if (this.IsInBounds(this.clusters[i].center, center, distType)){
            return i;
        }
    }
    return -1;
}
//MeanSift: кластеризация
MeanShift.prototype.Clusterize = function(distType){
    this.clusters.length = 0;
    let currCenters = [];
    for (let i = 0; i < this.dots.length; i++){
        let tmpCenter = this.dots[i];
        let flag = false;
        while (flag == false){
            let inBounds = [];
            for (let j = 0; j < this.dots.length; j++){
                if (this.IsInBounds(tmpCenter, this.dots[j], distType)){
                    inBounds.push(this.dots[j]);
                }
            }

            let newCenter = this.GetNewCenter(inBounds);
            if (tmpCenter.x == newCenter.x && tmpCenter.y == newCenter.y){
                flag = true;
                currCenters.push({cent:newCenter, dot: this.dots[i], cnt: inBounds.length});
            }
            else{
                tmpCenter = newCenter;
            }
        }
    }

    currCenters.sort((a, b) => b.cnt - a.cnt);
    this.clusters.push({center:{x:currCenters[0].cent.x,y:currCenters[0].cent.y}, dots:[]});
    for (let i = 0; i < currCenters.length; i++){
        let res = this.IsInClusters(currCenters[i].cent, distType);
        
        if (res != -1){
            this.clusters[res].dots.push(currCenters[i].dot);
        }
        else{
            this.clusters.push({center:{x:currCenters[i].cent.x,y:currCenters[i].cent.y}, dots:[]});
            this.clusters[this.clusters.length - 1].dots.push(currCenters[i].dot);
        }
    }
}
//Очистка поля
MeanShift.prototype.ClearCanvas = function(){
    this.clusters.length = 0;
    this.dots.length = 0;
    this.ctx2.clearRect(0, 0, this.width, this.height);
}

/**************************** DBSCAN *****************************/
function DBSCAN(canvas){
    this.canvas3 = canvas3;
    this.ctx3=canvas3.getContext('2d');
    this.dots = [];
    this.clusters = [];
    this.height = canvas.height;
    this.width = canvas.width;
    this.size = 5; //размер точек и центроидов

    this.minPts = 3;
    this.visited = [];
}
//Добавление точки в массив
DBSCAN.prototype.AddDot = function(x, y){
    this.dots.push({x:x,y:y});
    this.ClearClusters();
}
//Добавления центроида в кластеры
DBSCAN.prototype.AddCenter = function(x, y){
    this.clusters.push({center:{x:x,y:y}, dots:[]});
}
//Очистка кластера
DBSCAN.prototype.ClearClusters = function(){
    for (let i = 0; i < this.clusters.length; i++){
        this.clusters[i].dots.length = 0;
    }
}
//Hасстояние (разные метрики)
DBSCAN.prototype.Distance = function(dot, center, distType){
    if (distType == "Euclidian")
        return Math.sqrt((center.x-dot.x)*(center.x-dot.x)+(center.y-dot.y)*(center.y-dot.y));
    if (distType == "Manchattan")
        return Math.abs(center.x-dot.x) + Math.abs(center.y-dot.y);
    if (distType == "Chebichev")
        return Math.max(Math.abs(center.x-dot.x),Math.abs(center.y-dot.y));
}
//Рисуем кластеры
DBSCAN.prototype.DrawClusters = function(cluster, color){
    this.ctx3.fillStyle = this.ctx3.strokeStyle = color;
    this.ctx3.lineWidth = 2;
    for(let i = 0; i < cluster.dots.length; i++){
        this.ctx3.beginPath();
        this.ctx3.arc(cluster.dots[i].x, cluster.dots[i].y, this.size, 0, Math.PI*2);
        this.ctx3.fill();
    }
}
//Рисуем точки
DBSCAN.prototype.DrawDots = function(){
    for (let i = 0; i < this.dots.length; i++){
        this.ctx3.beginPath();
        this.ctx3.arc(this.dots[i].x, this.dots[i].y, this.size, 0, Math.PI * 2);
        this.ctx3.fillStyle = ctx3.strokeStyle = 'black';
        ctx3.fill();
    }
}
//Рисуем
DBSCAN.prototype.Draw = function(){
    this.ctx3.fillStyle='rgba(0, 0, 0, 0)';
    this.ctx3.clearRect(0, 0, this.width, this.height);
    this.DrawDots();
    for(let i = 0; i < this.clusters.length; i++){
        let part = i*23;
        let color='hsl('+part+', 80%, 50%)';
        this.DrawClusters(this.clusters[i], color);
    }
}
//DBSCAN: поиск соседей
DBSCAN.prototype.GetNeighbors = function(distType, dot, eps){
    let neighbors = [];
    for (let i = 0; i < this.dots.length; i++){
        if (this.Distance(this.dots[i], dot, distType) <= eps){
            neighbors.push(i);
        }
    }

    return neighbors; //массив индексов соседей
}
//DBSCAN: кластеризация
DBSCAN.prototype.Clusterize = function(distType, eps){
    this.clusters.length = 0;
    this.ClearClusters();
    let visited = [];
    for (let i = 0; i < this.dots.length; i++){
        if (visited[i] !== undefined){
            continue;
        }

        let neighbors = this.GetNeighbors(distType, this.dots[i], eps);
        if (neighbors.length < this.minPts){
            visited[i] = -1; //шум
            continue;
        }

        visited[i] = 1; //посетили
        this.clusters.push({center:{x:0,y:0}, dots:[]});
        this.clusters[this.clusters.length - 1].dots.push(this.dots[i]);
        
        for (let j = 0; j < neighbors.length; j++){
            let idx = neighbors[j];
            if (visited[idx] == -1){
                visited[idx] = 1;
                this.clusters[this.clusters.length - 1].dots.push(this.dots[idx]);
            }
            if (visited[idx] != undefined){
                continue;
            }

            visited[idx] = 1;
            this.clusters[this.clusters.length - 1].dots.push(this.dots[idx]);
            let currNeighbors = this.GetNeighbors(distType, this.dots[idx], eps);
            if (currNeighbors.length >= this.minPts){
                for (let j = 0; j < currNeighbors.length; j++){
                    neighbors.push(currNeighbors[j]);
                }
            }
        }
    }
}
//Очистка поля
DBSCAN.prototype.ClearCanvas = function(){
    this.clusters.length = 0;
    this.dots.length = 0;
    eps.value = 25;
    this.ctx3.clearRect(0, 0, this.width, this.height);
}

let canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');
let canvas2 = document.getElementById("myCanvas2");
var ctx2 = canvas2.getContext('2d');
let canvas3 = document.getElementById("myCanvas3");
var ctx3 = canvas3.getContext('2d');

var distType = document.getElementById("distanceBox");
var cnt = document.getElementById("labCount");
var eps = document.getElementById("labEps");
var count = 0;

let kmeans = new K_Means(canvas);
let meanshift = new MeanShift(canvas2);
let dbscan = new DBSCAN(canvas3);

kmeans.Draw();
meanshift.Draw();
dbscan.Draw();
canvas.addEventListener("click", e => {
    var mouse = {x: null, y: null}; //позиция курсора
    mouse.x = e.offsetX; //координаты
    mouse.y = e.offsetY; //клика мыши

    kmeans.AddDot(mouse.x, mouse.y);
    meanshift.AddDot(mouse.x, mouse.y);
    dbscan.AddDot(mouse.x, mouse.y);

    count++;
    cnt.max=count;

    kmeans.Draw();
    meanshift.Draw();
    dbscan.Draw();
});

/**************************** Buttons *****************************/
document.getElementById("clustButton").onclick = function ButtonKMeansClusterize(){
    kmeans.Clusterize(cnt.value, distType.value);
    kmeans.Draw();

    meanshift.Clusterize(distType.value);
    meanshift.Draw();

    dbscan.Clusterize(distType.value, eps.value);
    dbscan.Draw();
}

//Кнопка очистки поля
document.getElementById("clearButton").onclick = function ButtonClearCanvas(){
    kmeans.ClearCanvas();
    meanshift.ClearCanvas();
    dbscan.ClearCanvas();
}