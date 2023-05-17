import ipdb
import torch
from model.gru import GRUNet


def train():
    model = GRUNet(input_dim=2, hidden_dim=1, output_dim=2, n_layers=1)
    torch.save(model, './gru.pth')


if __name__ == "__main__":
    train()
