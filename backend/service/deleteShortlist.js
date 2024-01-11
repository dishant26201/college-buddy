import { DynamoDBClient, DynamoDB } from "@aws-sdk/client-dynamodb";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import buildResponse from '../utils/util.js';

const dynamodb = new DynamoDBClient({ region: "us-east-1" });
const userTable = 'Users';

async function deleteShortlist(deleteShortlistBody) {
    const uniIndex = deleteShortlistBody.uniIndex;
    const params = {
        TableName: userTable,
        Key: {
            EMAIL: deleteShortlistBody.email,
        },
        UpdateExpression: `REMOVE SHORTLISTED_UNIVERSITIES[${uniIndex}]`,
    };

    try {
        const data = await dynamodb.send(new UpdateCommand(params));
        console.log(data);
        return buildResponse(200, data);
    } catch (err) {
        console.error("There is an error: ", err);
        return buildResponse(403, {
            message: err
        });
    }
}

export default deleteShortlist;