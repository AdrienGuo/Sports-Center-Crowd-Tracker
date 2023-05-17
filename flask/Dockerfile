FROM pytorch/pytorch:1.6.0-cuda10.1-cudnn7-runtime

WORKDIR /app

COPY requirements.txt /app
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

COPY . /app

ENV FLASK_APP=app.py
ENTRYPOINT [ "flask", "run", "--reload" ]
CMD [ "--host", "0.0.0.0", "--port", "8000" ]
