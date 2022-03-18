// класс, определяющий нейросеть
class Network {

    datasetSize = 28; // Размер входных данных
    sigA = 1.0; // коэфициент для сигмоиды

    layerNeuronsN = [this.datasetSize ** 2, 25, 10]; // кол-во входов (изображение размером datasetSize ^ 2), размер внутр. слоя и кол-во выходов (цифры 0-9)

    layerN = this.layerNeuronsN.length; // кол-во слоев

    weights = new Array(); // матрциа весов
    biases = new Array(); // матрица смещений

    constructor() {
        // инициализировать матрицу весов и матрицу смещений
        for(let layer = 1; layer < this.layerN; layer++) {

            // в каждом слое создаем список нейронов
            this.weights[layer - 1] = new Array();

            // список сдвигов для каждого нейрона в каждом слое
            this.biases[layer - 1] = new Array();
            for (let neuron = 0; neuron < this.layerNeuronsN[layer]; neuron++) {

                // в каждом нейроне создаем список, где указываем веса связей оного с каждым нейроном из предыдущего слоя
                this.weights[layer - 1][neuron] = new Array();
                for (let prevNeuron = 0; prevNeuron < this.layerNeuronsN[layer - 1]; prevNeuron++) {
                    this.weights[layer - 1][neuron][prevNeuron] = Math.random(); // заполняем случайные числа в диапазоне [0; 1)
                }

                this.biases[layer - 1][neuron] = Math.random() * 10; // случайные числа в диапазоне [0; 10)
            }
        }
    }

    // функция активации нейрона - сигмоида
    sigmoid(x) {
        return 1 / (1 + Math.exp( -this.sigA * x ));
    }

    // производная сигмоиды
    sidmoidPrime(x) {
        return this.sigmoid(x) * (1 - this.sigmoid(x));
    }
}

// ******************* ДЛЯ ОТЛАДКИ *******************

network = new Network();

function show() { console.log(network.weights); }