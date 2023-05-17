import json
import sys

import torch

from flask import Flask, jsonify, request

from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def eprint(*args):
    print(*args, file=sys.stderr)


@app.route('/', methods=['GET'])
def hello():
    response = jsonify("Hello World")
    response.headers.add('Access-Control-Allow-Origin', '*')
    eprint(response)
    return response


@app.route('/predictOld', methods=['GET'])
def predictOld():
    pred = list()
    for _ in range(2):
        pred.append({
            'time': "2023-05-16T06:10:00.000Z",
            'gym': 21,
            'swim': 90,
        })
    response = jsonify(pred)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/predict', methods=['POST', 'GET'])
def predict():
    if request.method == "GET":
        eprint("Received GET method")
        preds = list()
        for _ in range(2):
            preds.append({
                'time': "2023-05-16T06:10:00.000Z",
                'gym': 21,
                'swim': 90,
            })
        eprint(preds)
    elif request.method == "POST":
        eprint("Received POST method")
        data = request.json
        if data:
            data = list(map(lambda elem: [elem['gym'], elem['swim']], data))

            preds = list()
            model = torch.load('./gru.pth')
            model.eval()
            h = model.init_hidden()
            pred, _ = model(data, h)
            pred = pred[0].tolist()
            preds.append({
                'time': "2023-05-16T06:10:00.000Z",
                'gym': pred[0],
                'swim': pred[1],
            })
        else:
            preds = [{
                'time': "2023-05-16T06:10:00.000Z",
                'gym': 21,
                'swim': 90,
            }]
    else:
        preds = jsonify("method is wrong")

    response = jsonify(preds)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
