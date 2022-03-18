// класс, определяющий нейросеть
class Network {

    datasetSize = 28;

    layerNeuronsN = [this.datasetSize ** 2, 25, 10]; // кол-во входов (изображение 50*50 = 2500), размер внутр. слоя и кол-во выходов (цифры 0-9)

    layerN = this.layerNeuronsN.length; // кол-во слоев

    weights = new Array();
    biases = new Array();

    constructor() {
        // инициализировать матрицу весов
        for(let layer = 1; layer < this.layerN; layer++) {

            // в каждом слое создаем список нейронов
            this.weights[layer - 1] = new Array();

            // список сдвигов для каждого нейрона в каждом слое
            this.biases[layer - 1] = new Array();
            for (let neuron = 0; neuron < this.layerNeuronsN[layer]; neuron++) {

                // в каждом нейроне создаем список, где указываем веса связей оного с каждым нейроном из предыдущего слоя
                this.weights[layer - 1][neuron] = new Array();
                for (let prevNeuron = 0; prevNeuron < this.layerNeuronsN[layer - 1]; prevNeuron++) {
                    this.weights[layer - 1][neuron][prevNeuron] = Math.random();
                }

                this.biases[layer - 1][neuron] = Math.random() * 10;
            }
        }
    }
}

// ******************* ДЛЯ ОТЛАДКИ *******************

network = new Network();

function show() { console.log(network.weights); }