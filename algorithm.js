// import {circles} from 'canvas.js';
// function geneticAlgorithm(){
//     let generations = []; //массив где будут храниться все наши поколения (пути)
//     let fitness = []; //массив с длинами путей
//     let countGenerations = countOfelement(circles.length); //генерация оптимального(нет) кол-ва предков
//     for (let i = 0; i < countGenerations; i++) {
//         generations[i] = firstGeneration(chromosome); //генерация первого поколения 
//     }
//     for (let i = 0; i < generations.length; i++) {
//         fitness[i] = distance(generations[i]); //подсчет длин путей для каждого предка
//     }
// }

// //нахождение оптимального(нет) кол-ва предков
// function countOfelement(length) {
//     if (length <= 3) return length;
//     let count = 1;
//     for (let i = 3; i <= length; i++) {
//         count *= i;
//     }
//     return count;
// }

// //генерация первого поколения
// function firstGeneration (chromosome) {
//     let editChromosome = [];
//     editChromosome = chromosome.slice();
//     editChromosome.shift();
//     shuffle(editChromosome);
//     editChromosome.push(chromosome[0]);
//     editChromosome.unshift(chromosome[0]);
//     return editChromosome;
// }

// //нахождение дистанции(фитнесса)
// function distance(chromosome) {
//     let resultDistance = 0;
//     for (let i = 0; i < chromosome.length - 1; i++) { //расстояние от точки до точки
//         let xDist;
//         let yDist;
//         let Dist;
//         xDist = Math.abs(chromosome[i].x - chromosome[i + 1].y);
//         yDist = Math.abs(chromosome[i].y - chromosome[i + 1].y);
//         Dist = Math.sqrt((Math.pow(xDist, 2)) + (Math.pow(yDist, 2)));
//         resultDistance += Dist;
//     }
//     return resultDistance;
// }

// //перемешивание массива
// function shuffle(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//       let j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
// }

// //кроссинговер или скрещивание()
// function crossing(ancestor1, ancestor2) {

// }