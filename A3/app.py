from flask import Flask, jsonify, request
import requests
import base64
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding

app = Flask(__name__)

@app.route('/',  methods=['GET'])
def index():
    return 'Welcome to Assignment 3!'


@app.route("/start", methods=['GET', 'POST'])
def start():

    # send banner id and IPv4 of EC2 instance (listening on port 5000)
    bannerJson = {
        "banner": "B00843009",
        "ip": "52.86.91.47:5000"
    }

    # post to /start endpoint of profs app and pass my credentials in json
    ans = requests.post("http://44.202.179.158:8080//start", json=bannerJson)

    # return response with status code 200
    return ans.text, 200 


# endpoint to decrypt
@app.route("/decrypt", methods=['GET', 'POST'])
def decrypt():

    # collect json input i.e. plaintext
    input = request.get_json()
    encryptedMessage = input['message']

    # read private key
    with open("private.txt", "rb") as private:
        privateKey = serialization.load_pem_private_key(private.read(), password=None)

    # convert base64 to binary data
    binaryData = base64.b64decode(encryptedMessage)

    # decrypt binary data with private key
    decryptedMessage = privateKey.decrypt(
        binaryData, 
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA1()),
            algorithm=hashes.SHA1(),
            label=None
        )
    )

    # convert decrypted message to string
    decryptedMessageString = str(decryptedMessage, encoding='utf8')

    # return decrypted message in string format with status code 200
    return jsonify({'response': decryptedMessageString}), 200


# endpoint to encrypt
@app.route("/encrypt", methods=['GET', 'POST'])
def encrypt():

    # collect json input i.e. plaintext
    input = request.get_json()
    plainText = input['message']

    # read public key
    with open("public.txt", "rb") as public:
        publicKey = serialization.load_pem_public_key(public.read())

    # encrypt plaintext with public key
    bytesConvert = bytes(plainText, encoding='utf8')
    encryptedMessage = publicKey.encrypt(
        bytesConvert,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA1()),
            algorithm=hashes.SHA1(),
            label=None
        )
    )

    # convert encrypted message to base64 string
    encryptedMessage  = str(base64.b64encode(encryptedMessage), encoding='utf-8')

    # return encrypted message string with status code 200
    return jsonify({'response': encryptedMessage}), 200

if __name__ == '__main__':
    app.run(host = "0.0.0.0", port = 5000, debug = True)


# References:

# Source: AWS EC2 and S3 Panopto recording
# URL: https://dal.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=a29684bd-9478-4dc1-b67e-afa500cfa377
# Date accessed: February 20, 2023

# Source URL: https://gist.github.com/gabrielfalcao/de82a468e62e73805c59af620904c124
# Date accessed: March 16, 2023

# Source URL: https://medium.com/@Raulgzm/rsa-with-cryptography-python-library-462b26ce4120
# Date accessed: March 16, 2023