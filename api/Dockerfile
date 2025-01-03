FROM python:3.10-slim

EXPOSE 8000

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

CMD ["python", "api.py"]