FROM python:3.12.3

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# TO-DO: For debug on local 
RUN pip install debugpy

# For static files and compress
# run python manage.py collectstatic --noinput && python manage.py compress

EXPOSE 8000
