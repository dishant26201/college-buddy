# Reference for app.py template:
# Source: Lab 3 Panopto recording
# URL: https://dal.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=201adc2b-2403-4fbd-88e7-af9701384da3
# Date accessed: February 01, 2023

from flask import Flask, jsonify, request
from os import path
import requests

app = Flask(__name__)

@app.route('/checksum', methods=['GET', 'POST'])
def checksum():
    input = request.get_json()
    file = input['file']
    if file is None:
        return jsonify({'file': file, 'error': 'Invalid JSON input.'})
    else:
        fileName= "/dockerVolume/{}".format(file)
        if path.exists(fileName):
            ans = requests.post("http://container2:9090", json=input)
            return jsonify({'checksum': ans.text, 'file': file})
        else:
            return jsonify({'error': 'File not found.', 'file': file})
