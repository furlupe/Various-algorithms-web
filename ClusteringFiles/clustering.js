//к-средних
function K_Means(canvas){
    this.canvas = canvas;
    this.ctx=canvas.getContext('2d');
    this.dots = [];
    this.clusters = [];
    //this.diffDots = []; //точки, которые относятся к разым кластерам в зависимости от метрики
    this.height = canvas.height;
    this.width = canvas.width;
    this.size = 5; //размер точек и центроидов
}
//Добавление точки в массив
K_Means.prototype.AddDot = function(x, y){
    this.dots.push({x:x,y:y});
    this.ClearClusters();
}
//Добавления центраида в кластеры
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
//расстояние (разные метрики)
K_Means.prototype.Distance = function(dot, center, distType){
    if (distType == "Euclidian")
        return Math.sqrt((center.x-dot.x)*(center.x-dot.x)+(center.y-dot.y)*(center.y-dot.y));
    if (distType == "Manchattan")
        return Math.abs(center.x-dot.x) + Math.abs(center.y-dot.y);
    if (distType == "Chebichev")
        return Math.max(Math.abs(center.x-dot.x),Math.abs(center.y-dot.y));
}
//Поиск кластера для точки
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
//Проверка на смену центроида для кластера
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
//Рисовать области
K_Means.prototype.DrawAreas = function(distType){
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
K_Means.prototype.Draw = function(distType, drawAreas = null){
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
//Инициализация центров
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
//Кластеризация
K_Means.prototype.Clusterize = function(cnt, distType){
    k_means.InitCenters(cnt, distType);
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

let canvas = document.getElementById("myCanvas");
var ctx=canvas.getContext('2d');
var distType = document.getElementById("distanceBox");
var drawAreas=document.getElementById("areasCheckbox");
var cnt=document.getElementById("labCount");
var count = 0;
let k_means = new K_Means(canvas);

k_means.Draw(distType.value);
canvas.addEventListener("click", e => {
    var mouse = {x:0, y:0}; //позиция курсора
    mouse.x = e.offsetX; //координаты
    mouse.y = e.offsetY; //клика мыши

    k_means.AddDot(mouse.x, mouse.y);
    count++;

    k_means.Draw(distType.value);
    cnt.max=count;
});
//Кнопка кластеризации
function ButtonClusterize(){
    k_means.Clusterize(cnt.value, distType.value);
    if (drawAreas.checked){
        k_means.Draw(distType.value, drawAreas);
    }
    else{
        k_means.Draw(distType.value);
    }
}
//Очистка поля
K_Means.prototype.ClearCanvas = function(){
    this.clusters.length = 0;
    this.dots.length = 0;
    cnt.max = 1;
    cnt.value = 1;
    count = 0;
    this.ctx.clearRect(0, 0, this.width, this.height);
}
//Кнопка очистки поля
function ButtonClearCanvas(){
    k_means.ClearCanvas();
}