import { SNSClient, SubscribeCommand } from "@aws-sdk/client-sns";
import buildResponse from '../utils/util.js';

const sns = new SNSClient({ region: "us-east-1" });

async function addSubscriber(addSubscriberBody) {

    const topicArn = "arn:aws:sns:us-east-1:917983641996:email-shortlist";

    const subscribeParams = {
        Protocol: "email",
        TopicArn: topicArn, 
        Endpoint: addSubscriberBody.EMAIL,
    };
    
    const subscribeCommand = new SubscribeCommand(subscribeParams);
    
    try {
        const data = await sns.send(subscribeCommand);
        console.log("Subscription successful:", data);
        return buildResponse(200, data);
    } 
    catch (err) {
        console.error("Error subscribing user:", err);
        return buildResponse(403, {
            message: err
        });
    }
    
}

export default addSubscriber;