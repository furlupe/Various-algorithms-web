import random
import numpy as np
import gzip, pickle


class Network():
    def __init__(self, sizes):
        self.num_layers = len(sizes)
        self.sizes = sizes

        self.biases = [np.random.randn(y, 1) for y in sizes[1:]] # сдвиги для каждого слоя
        self.weights = [np.random.randn(y, x) for x, y in zip(sizes[:-1], sizes[1:])] # веса ребер

    def sigmoid(self, x):
        return 1.0 / (1.0 + np.exp(-x))

    def sigmoid_prime(self, x):
        return self.sigmoid(x) * (1.0 - self.sigmoid(x))

    def cost_derivative(self, output_acts, y):
        return (output_acts - y) # функция ошибки

    def feedforward(self, a):
        for b, w in zip(self.biases, self.weights):
            a = self.sigmoid(np.dot(w, a) + b) # тупо линал W * A + B
        return a

    # обратное распространение
    def backprop(self, x, y):
        nabla_b = [np.zeros(b.shape) for b in self.biases]
        nabla_w = [np.zeros(w.shape) for w in self.weights]

        act = x
        acts = [x]
        zs = []

        # прямое распространение
        for b, w in zip(self.biases, self.weights):
            z = np.dot(w, act) + b
            zs.append(z)

            act = self.sigmoid(z)
            acts.append(act)

        delta = self.cost_derivative(acts[-1], y) * self.sigmoid_prime(zs[-1]) # находим дельту для последнего слоя
        nabla_b[-1] = delta # записываем ее
        nabla_w[-1] = np.dot(delta, acts[-2].transpose()) # меняем веса на последнем слое

        # проделываем действия, аналогичные для последнего слоя, с остальными
        for l in range(2, self.num_layers):
            z = zs[-l]
            sp = self.sigmoid_prime(z)
            
            delta = np.dot(self.weights[-l + 1].transpose(), delta) * sp
            nabla_b[-l] = delta
            nabla_w[-l] = np.dot(delta, acts[-l - 1].transpose())

        return (nabla_b, nabla_w)

    # обновить веса для данной "пачки" входных данных
    def update_batch(self, batch, eta):
        nabla_b = [np.zeros(b.shape) for b in self.biases] # градиенты сдвигов
        nabla_w = [np.zeros(w.shape) for w in self.weights] # градиенты веосв

        for x, y in batch:
            delta_nabla_b, delta_nabla_w = self.backprop(x, y) # послойное вычисление градиентов

            nabla_b = [nb + dnb for nb, dnb in zip(nabla_b, delta_nabla_b)] # применение градиента
            nabla_w = [nw + dnw for nw, dnw in zip(nabla_w, delta_nabla_w)]

        self.weights = [w - (eta / len(batch)) * nw for w, nw in zip(self.weights, nabla_w)] # Обновить веса
        self.biases = [b - (eta / len(batch)) * nb for b, nb in zip(self.biases, nabla_b)] # Обновить сдвиги

    def evaluate(self, test_data):
        test_results = [(np.argmax(self.feedforward(x)), y) for x, y in test_data]
        return sum(int(x == y) for (x, y) in test_results)

    # стохатический градиент
    def SGD(self, training_data, epochs, batch_size, eta, test_data):
        test_data = list(test_data)
        n_test = len(test_data)

        training_data = list(training_data)
        n = len(training_data)
        for j in range(epochs):
            random.shuffle(training_data)
            batches = [training_data[k:k+batch_size] for k in range(0, n, batch_size)]

            for batch in batches:
                self.update_batch(batch, eta)

            print("Epoch {0}: {1} / {2}".format(j, self.evaluate(test_data), n_test))


def vectorized_result(j):
    e = np.zeros((10, 1))
    e[j] = 1.0
    return e


def load_data():
    f = gzip.open('mnist.pkl.gz', 'rb')
    training_data, validation_data, test_data = pickle.load(f, encoding='latin1')
    f.close()
    return training_data, validation_data, test_data


def load_data_wrapper():
    tr_d, va_d, te_d = load_data()

    training_inputs = [np.reshape(x, (784, 1)) for x in tr_d[0]]
    training_results = [vectorized_result(y) for y in tr_d[1]]
    training_data = zip(training_inputs, training_results)

    validation_inputs = [np.reshape(x, (784, 1)) for x in va_d[0]]
    validation_data = zip(validation_inputs, va_d[1])

    test_inputs = [np.reshape(x, (784, 1)) for x in te_d[0]]
    test_data = zip(test_inputs, te_d[1])

    return training_data, validation_data, test_data


training_data, val_data, test_data = load_data_wrapper()

net = Network([784, 30, 10])
net.SGD(training_data, 30, 10, 3.0, test_data=test_data)
