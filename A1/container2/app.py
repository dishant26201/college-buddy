# Reference for app.py template:
# Source: Lab 3 Panopto recording
# URL: https://dal.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=201adc2b-2403-4fbd-88e7-af9701384da3
# Date accessed: February 01, 2023

from flask import Flask, request
import hashlib

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def checksumApp2():
    input = request.get_json()
    fileName= "/dockerVolume/{}".format(input['file'])

    # Reference for MD5 hash algorithm:
    # Source: https://www.quickprogrammingtips.com/python/how-to-calculate-md5-hash-of-a-file-in-python.html
    # Date accessed: February 01, 2023
    with open(fileName, "rb") as file:
        bin = file.read()
        md5 = hashlib.md5(bin).hexdigest()
        return md5
