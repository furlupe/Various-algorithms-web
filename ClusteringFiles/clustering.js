/**************************** Общее *****************************/
//Кластеризация
function Clustering(canvas){
    this.canvas = canvas;
    this.ctx=canvas.getContext('2d');
    this.dots = [];
    this.clusters = [];
    this.height = canvas.height;
    this.width = canvas.width;
    this.size = 5; //размер точек и центроидов

    this.radius = 50; //радиус для meanshift

    this.minPts = 3; //минимальное количество точек для кластера DBSCAN
    this.visited = [];
}
//Добавление точки в массив
Clustering.prototype.AddDot = function(x, y){
    this.dots.push({x:x,y:y});
    this.ClearClusters();
}
//Добавления центроида в массив (кластер)
Clustering.prototype.AddCenter = function(x, y){
    this.ClearClusters();
    this.clusters.push({center:{x:x,y:y}, dots:[]});
}
//Очистка кластера
Clustering.prototype.ClearClusters = function(){
    for (let i = 0; i < this.clusters.length; i++){
        this.clusters[i].dots.length = 0;
    }
}
//Расстояние (разные метрики)
Clustering.prototype.Distance = function(dot, center, distType){
    if (distType == "Euclidian")
        return Math.sqrt((center.x-dot.x)*(center.x-dot.x)+(center.y-dot.y)*(center.y-dot.y));
    if (distType == "Manchattan")
        return Math.abs(center.x-dot.x) + Math.abs(center.y-dot.y);
    if (distType == "Chebichev")
        return Math.max(Math.abs(center.x-dot.x),Math.abs(center.y-dot.y));
}
//Рисуем области
Clustering.prototype.DrawAreas = function(distType){
    if (this.clusters.length < 2){
        let part = 17;
        this.ctx.fillStyle = 'hsl('+part+', 80%, 90%)';
        this.ctx.fillRect(0, 0, this.height, this.width);
    }
    else{
        for (let h = 0; h < this.height; h++){
            for (let w = 0; w < this.width; w++){
                let currPiece = {x: h, y: w};
                let index = this.GetClusterIndex(currPiece, distType);
                let part = index*17;
                this.ctx.fillStyle = 'hsl('+part+', 80%, 90%)';
                this.ctx.fillRect(h, w, 1, 1);
            }
        }
    }
}
//Рисуем кластеры
Clustering.prototype.DrawClusters = function(cluster, color){
    this.ctx.fillStyle = this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    for(let i = 0; i < cluster.dots.length; i++){
        this.ctx.beginPath();
        this.ctx.arc(cluster.dots[i].x, cluster.dots[i].y, this.size, 0, Math.PI*2);
        this.ctx.fill();
    }
    if (document.getElementById("clusteringTypeBox") != "dbscan"){
        this.ctx.beginPath();
        this.ctx.moveTo(cluster.center.x - this.size, cluster.center.y - this.size);
        this.ctx.lineTo(cluster.center.x + this.size, cluster.center.y + this.size);
        this.ctx.moveTo(cluster.center.x - this.size, cluster.center.y + this.size);
        this.ctx.lineTo(cluster.center.x + this.size, cluster.center.y - this.size);
        this.ctx.stroke();
    }
}
//Рисуем точки
Clustering.prototype.DrawDots = function(){
    for (let i = 0; i < this.dots.length; i++){
        this.ctx.beginPath();
        this.ctx.arc(this.dots[i].x, this.dots[i].y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = ctx.strokeStyle = 'black';
        ctx.fill();
    }
}
//Рисуем все вместе
Clustering.prototype.Draw = function(distType, drawAreas = null){
    this.ctx.fillStyle='#eee';
    this.ctx.fillRect(0, 0, this.width, this.height);
    if (drawAreas != null){
        this.DrawAreas(distType);
    }
    this.DrawDots();
    for(let i = 0; i < this.clusters.length; i++){
        let part = i*17;
        let color='hsl('+part+', 80%, 50%)';
        this.DrawClusters(this.clusters[i], color);
    }
}
//Очистка поля
Clustering.prototype.ClearCanvas = function(){
    this.clusters.length = 0;
    this.dots.length = 0;
    cnt.max = 1;
    cnt.value = 1;
    count = 0;

    eps.value = 5;
    this.ctx.clearRect(0, 0, this.width, this.height);
}

/**************************** K_Means++ *****************************/
//K-Means++: поиск индекса кластера для точки
Clustering.prototype.GetClusterIndex = function(dot, distType){
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
Clustering.prototype.IsChangedCentroids = function(){
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
//K-Means++: инициализация центров
Clustering.prototype.InitCenters = function(cnt, distType){
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
Clustering.prototype.KMeansClusterize = function(cnt, distType){
    this.InitCenters(cnt, distType);
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

/**************************** MeanShift *****************************/
//MeanShift: найти новый центр (для сдвига)
Clustering.prototype.GetNewCenter = function(arr){
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
Clustering.prototype.IsInBounds = function(center, dot){
    let dist = this.Distance(dot, center, "Euclidian");
    if (dist <= this.radius){
        return true;
    }
    else{
        return false;
    }
}
//MeanShift: проверка, есть ли уже в области существующего центра
Clustering.prototype.IsInClusters = function(center){
    for (let i = 0; i < this.clusters.length; i++){
        if (this.IsInBounds(this.clusters[i].center, center)){
            return i;
        }
    }
    return -1;
}
//MeanSift: кластеризация
Clustering.prototype.MeanShiftClusterize = function(){
    let currCenters = [];
    for (let i = 0; i < this.dots.length; i++){
        let tmpCenter = this.dots[i];
        let flag = false;
        while (flag == false){
            let inBounds = [];
            for (let j = 0; j < this.dots.length; j++){
                if (this.IsInBounds(tmpCenter, this.dots[j])){
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
    for (let i = 0; i < currCenters.length; i++){
        let res = this.IsInClusters(currCenters[i].cent);
        
        if (res != -1){
            this.clusters[res].dots.push(currCenters[i].dot);
        }
        else{
            this.clusters.push({center:{x:currCenters[i].cent.x,y:currCenters[i].cent.y}, dots:[]});
            this.clusters[this.clusters.length - 1].dots.push(currCenters[i].dot);
        }
    }
}

/**************************** DBSCAN *****************************/
//DBSCAN: поиск соседей
Clustering.prototype.GetNeighbors = function(distType, dot, eps){
    let neighbors = [];
    for (let i = 0; i < this.dots.length; i++){
        if (this.Distance(this.dots[i], dot, distType) <= eps){
            neighbors.push(i);
        }
    }

    return neighbors; //массив индексов соседей
}
//DBSCAN: кластеризация
Clustering.prototype.DBSCANClusterize = function(distType, eps){
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

let canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');
var distType = document.getElementById("distanceBox");
var drawAreas = document.getElementById("areasCheckbox");
var cnt = document.getElementById("labCount");
var eps = document.getElementById("labEps");
var count = 0;
let clustering = new Clustering(canvas);

clustering.Draw(distType.value);
canvas.addEventListener("click", e => {
    var mouse = {x: null, y: null}; //позиция курсора
    mouse.x = e.offsetX; //координаты
    mouse.y = e.offsetY; //клика мыши

    clustering.AddDot(mouse.x, mouse.y);
    count++;

    clustering.Draw(distType.value);
    cnt.max=count;
});

//K-Means: кнопка кластеризации
document.getElementById("clustButton").onclick = function ButtonKMeansClusterize(){
    clustering.KMeansClusterize(cnt.value, distType.value);
    if (drawAreas.checked){
        clustering.Draw(distType.value, drawAreas);
    }
    else{
        clustering.Draw(distType.value);
    }
}

/**************************** Buttons *****************************/
document.getElementById("eps").style.display="none";

//Смена типа кластеризации при изменении выбора
function SwitchClustering(){
    if (document.getElementById("clusteringTypeBox").value == "kmeans"){
        document.getElementById("kmeans_options").style.display="block";
        document.getElementById("eps").style.display="none";

        //K-Means: кнопка кластеризации
        document.getElementById("clustButton").onclick = function ButtonKMeansClusterize(){
            clustering.KMeansClusterize(cnt.value, distType.value);
            if (drawAreas.checked){
                clustering.Draw(distType.value, drawAreas);
            }
            else{
                clustering.Draw(distType.value);
            }
        };

    }
    if (document.getElementById("clusteringTypeBox").value == "meanshift"){
        document.getElementById("kmeans_options").style.display="none";
        document.getElementById("eps").style.display="none";

        //MeanShift: кнопка кластеризации
        document.getElementById("clustButton").onclick = function ButtonMeanShiftClusterize(){
            clustering.MeanShiftClusterize();
            clustering.Draw(distType.value);
        };
    }
    if (document.getElementById("clusteringTypeBox").value == "dbscan"){
        document.getElementById("kmeans_options").style.display="none";
        document.getElementById("distances").style.display="block";
        document.getElementById("eps").style.display="block";

        //DBSCAN: кнопка кластеризации
        document.getElementById("clustButton").onclick = function ButtonDBSCANClusterize(){
            clustering.DBSCANClusterize(distType.value, eps.value);
            clustering.Draw(distType.value);
        };
    }
}

//Кнопка очистки поля
document.getElementById("clearButton").onclick = function ButtonClearCanvas(){
    clustering.ClearCanvas();
}