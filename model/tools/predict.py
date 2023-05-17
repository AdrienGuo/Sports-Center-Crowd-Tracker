from database.pg import database
from model.gru import GRUNet
import ipdb


def predict():
    data = database.select_all()
    model = GRUNet(input_dim=2, hidden_dim=1, output_dim=2, n_layers=1)
    model.eval()
    data = data[-30:]
    data = list(map(lambda elem: [elem[1], elem[2]], data))
    print(data)
    h = model.init_hidden()
    pred, _ = model(data, h)
    pred = pred[0].tolist()
    print(pred)


if __name__ == "__main__":
    predict()
