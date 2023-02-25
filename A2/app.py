# Reference for app.py template:
# Source: AWS EC2 and S3 Panopto recording
# URL: https://dal.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=a29684bd-9478-4dc1-b67e-afa500cfa377
# Date accessed: February 20, 2023

from flask import Flask, jsonify, request
import boto3
import requests

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def start():
    # send banner id and IPv4 of EC2 instance
    bannerJson = {
        "banner": "B00843009",
        "ip": "3.235.124.108"
    }

    ans = requests.post("http://52.91.127.198:8080/start", json=bannerJson)

    return ans.text, 200

# endpoint to create file
@app.route("/storedata", methods=['GET', 'POST'])
def upload_file():
    input = request.get_json()
    storeData = input['data']

    s3 = boto3.resource(
        's3',
        aws_access_key_id="ASIA5LPAWYGGFYEF2XMD",
        aws_secret_access_key="g8k8y56PAZOj8eoZsDPfsgoilyfTD2f1If6HOweW",
        aws_session_token="FwoGZXIvYXdzEIz//////////wEaDAqox9M3AUD43aIwMCLAASKCSieuPHvGxXB+aDNUzjUm3M+uxLg69WEn569HHH8rr7wr77+24OrPv8AzKgO49oMao2guI7H7QetOFZ0Sw10tWqwBkHHeWGnsF4+lQQrv1NWu1jJzLe98BHjNPm/l3MGopH3PABR/4CLnrQTAjRYuOPQuCGe0rZSgUKON1FcjD5t4B3chT8+gHDFawO5rbttKUDRKaX9PKbSiLg8NgnV/q+unnFWM/1uUhNyc4ulP0Iemd2JBfimBteXds6OBcCjY7eWfBjItUNidKiU/dHMWCIzfady7OMSrAqiGtfkTOjB6bCAU2wB+SVhKFUWALOLyBir4",
        region_name="us-east-1"
    )
    
    s3.Object('dishanttest', 'newfile.txt').put(Body=storeData, ACL='public-read')

    return jsonify({'s3uri': "https://dishanttest.s3.amazonaws.com/newfile.txt"}), 200

# endpoint to append
@app.route("/appenddata", methods=['GET', 'POST'])
def append_file():
    input = request.get_json()
    data = input['data']

    s3 = boto3.resource(
        's3',
        aws_access_key_id="ASIA5LPAWYGGFYEF2XMD",
        aws_secret_access_key="g8k8y56PAZOj8eoZsDPfsgoilyfTD2f1If6HOweW",
        aws_session_token="FwoGZXIvYXdzEIz//////////wEaDAqox9M3AUD43aIwMCLAASKCSieuPHvGxXB+aDNUzjUm3M+uxLg69WEn569HHH8rr7wr77+24OrPv8AzKgO49oMao2guI7H7QetOFZ0Sw10tWqwBkHHeWGnsF4+lQQrv1NWu1jJzLe98BHjNPm/l3MGopH3PABR/4CLnrQTAjRYuOPQuCGe0rZSgUKON1FcjD5t4B3chT8+gHDFawO5rbttKUDRKaX9PKbSiLg8NgnV/q+unnFWM/1uUhNyc4ulP0Iemd2JBfimBteXds6OBcCjY7eWfBjItUNidKiU/dHMWCIzfady7OMSrAqiGtfkTOjB6bCAU2wB+SVhKFUWALOLyBir4",
        region_name="us-east-1"
    )
    
    obj = s3.Object("dishanttest","newfile.txt")
    body = obj.get()['Body'].read()
    appendData = body + str.encode(data)

    s3.Object('dishanttest', 'newfile.txt').put(Body=appendData, ACL='public-read')

    return jsonify({'s3uri': "https://dishanttest.s3.amazonaws.com/newfile.txt"}), 200

# endpoint to delete
@app.route("/deletefile", methods=['GET', 'POST'])
def delete_file():
    input = request.get_json()
    urlOfFile = input['s3uri']
    tempArr = urlOfFile.split("/")
    nameOfFile = tempArr[len(tempArr) - 1]

    s3 = boto3.resource(
        's3',
        aws_access_key_id="ASIA5LPAWYGGFYEF2XMD",
        aws_secret_access_key="g8k8y56PAZOj8eoZsDPfsgoilyfTD2f1If6HOweW",
        aws_session_token="FwoGZXIvYXdzEIz//////////wEaDAqox9M3AUD43aIwMCLAASKCSieuPHvGxXB+aDNUzjUm3M+uxLg69WEn569HHH8rr7wr77+24OrPv8AzKgO49oMao2guI7H7QetOFZ0Sw10tWqwBkHHeWGnsF4+lQQrv1NWu1jJzLe98BHjNPm/l3MGopH3PABR/4CLnrQTAjRYuOPQuCGe0rZSgUKON1FcjD5t4B3chT8+gHDFawO5rbttKUDRKaX9PKbSiLg8NgnV/q+unnFWM/1uUhNyc4ulP0Iemd2JBfimBteXds6OBcCjY7eWfBjItUNidKiU/dHMWCIzfady7OMSrAqiGtfkTOjB6bCAU2wB+SVhKFUWALOLyBir4",
        region_name="us-east-1"
    )

    s3.Object('dishanttest', 'newfile.txt').delete()

    # return jsonify({'nameOfDeletedFile': "nameOfFile"}), 200
    return jsonify({'s3uri': "https://dishanttest.s3.amazonaws.com/newfile.txt"}), 200