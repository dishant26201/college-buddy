import  { SQSClient } from "@aws-sdk/client-sqs";
// Set the AWS Region.
const REGION = "us-east-1"; //e.g. "us-east-1"
// Create SQS service object.
const sqsClient = new SQSClient({ region: REGION });
export  { sqsClient };


// References:

// Source URL: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/sqs-examples-send-receive-messages.html
// Date accessed: March 30, 2023

// Source URL: https://www.youtube.com/watch?v=xyHLX1dUwuA
// Date accessed: March 30, 2023