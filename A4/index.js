import {
    ReceiveMessageCommand,
    DeleteMessageCommand,
} from  "@aws-sdk/client-sqs";
import { sqsClient } from  "./libs/sqsClient.js";

const pollPath = '/poll';

export const handler = async(event) => {
    const connectURL = "https://sqs.us-east-1.amazonaws.com/917983641996/Connect";
    const publishURL = "https://sqs.us-east-1.amazonaws.com/917983641996/Publish";
    const subscribeURL = "https://sqs.us-east-1.amazonaws.com/917983641996/Subscribe";
    
    let response;
    switch (true) {
        case event.httpMethod === 'POST' && event.path === pollPath:
            const eventBody = JSON.parse(event.body);
            if (eventBody.type === "CONNECT") {
                const params = {
                    MaxNumberOfMessages: 1,
                    MessageAttributeNames: [
                        "All"
                    ],
                    QueueUrl: connectURL,
                    VisibilityTimeout: 20,
                    WaitTimeSeconds: 0
                };
                const data = await sqsClient.send(new ReceiveMessageCommand(params));
                const messageBody = JSON.parse(data.Messages[0].Body);
                const body = {
                    "type": "CONNACK",
                    "returnCode": 0,
                    "username": messageBody.username,
                    "password": messageBody.password
                };
                const deleteParams = {
                    QueueUrl: connectURL,
                    ReceiptHandle: data.Messages[0].ReceiptHandle,
                };
                await sqsClient.send(new DeleteMessageCommand(deleteParams));
                response = buildResponse(200, body);
            }
            else if (eventBody.type === "SUBSCRIBE") {
                const params = {
                    MaxNumberOfMessages: 1,
                    MessageAttributeNames: [
                        "All"
                    ],
                    QueueUrl: subscribeURL,
                    VisibilityTimeout: 20,
                    WaitTimeSeconds: 0
                };
                const data = await sqsClient.send(new ReceiveMessageCommand(params));
                const messageBody = JSON.parse(data.Messages[0].Body);
                const body = {
                    "type": "SUBACK",
                    "returnCode": messageBody.qos,
                };
                const deleteParams = {
                    QueueUrl: subscribeURL,
                    ReceiptHandle: data.Messages[0].ReceiptHandle,
                };
                await sqsClient.send(new DeleteMessageCommand(deleteParams));
                response = buildResponse(200, body);
            }
            else if (eventBody.type === "PUBLISH") {
                const params = {
                    MaxNumberOfMessages: 10,
                    MessageAttributeNames: [
                        "All"
                    ],
                    QueueUrl: publishURL,
                    VisibilityTimeout: 20,
                    WaitTimeSeconds: 0
                };
                const data = await sqsClient.send(new ReceiveMessageCommand(params));
                const messageBody = JSON.parse(data.Messages[0].Body);
                const body = {
                    "type": "PUBACK",
                    "returnCode": messageBody.qos,
                    "payload": {
                        "key": messageBody.payload.key,
                        "value": messageBody.payload.value
                    }
                };
                const deleteParams = {
                    QueueUrl: publishURL,
                    ReceiptHandle: data.Messages[0].ReceiptHandle,
                };
                await sqsClient.send(new DeleteMessageCommand(deleteParams));
                response = buildResponse(200, body);
            }
            else {
                response = buildResponse(404, "404 Not Found!");
            }
            break;
        default:
            response = buildResponse(404, "404 Not Found!");
    }
    return response;
};

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
}


// References:

// Source URL: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/sqs-examples-send-receive-messages.html
// Date accessed: March 30, 2023

// Source URL: https://www.youtube.com/watch?v=xyHLX1dUwuA
// Date accessed: March 30, 2023