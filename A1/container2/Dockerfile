# Reference for Dockerfile template:
# Source: Lab 3 Panopto recording
# URL: https://dal.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=201adc2b-2403-4fbd-88e7-af9701384da3
# Date accessed: February 01, 2023

FROM python

WORKDIR /usr/src/app

COPY ./app.py .

COPY ./requirements.txt .

RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 9090

CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=9090"]
