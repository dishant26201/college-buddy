import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import buildResponse from '../utils/util.js';

const sns = new SNSClient({ region: "us-east-1" });

async function emailShortlist(emailShortlistBody) {

  const shortlist = emailShortlistBody.shortlist;
  const email = emailShortlistBody.email;

  const message = `Here is your college shortlist: ${shortlist}`;
  const topicArn = "arn:aws:sns:us-east-1:917983641996:email-shortlist";

  const params = {
    Message: message,
    TopicArn: topicArn,
    MessageAttributes: {
        email: {
            DataType: 'String',
            StringValue: email
        }
    }
  };

  try {
    const response = await sns.send(new PublishCommand(params));
    console.log('Message published to SNS topic', response);
    return buildResponse(200, response);
  } 
  catch (err) {
    console.log("Error", err);
    return buildResponse(403, {
        message: err
    });
  }
    
}

export default emailShortlist;