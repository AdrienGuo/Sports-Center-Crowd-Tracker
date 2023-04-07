from database.pg import database
from model.gru import GRUNet


def predict():
    data = database.select_all()
    model = GRUNet(input_dim=2, hidden_dim=10, output_dim=2, n_layers=1)


if __name__ == "__main__":
    predict()
