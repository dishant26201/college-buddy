import { DynamoDBClient, DynamoDB } from "@aws-sdk/client-dynamodb";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import buildResponse from '../utils/util.js';

const dynamodb = new DynamoDBClient({ region: "us-east-1" });
const userTable = 'Users';

async function addShortlist(addShortlistBody) {
    const university = addShortlistBody.university;
    const params = {
        TableName: userTable,
        Key: {
            EMAIL: addShortlistBody.email,
        },
        UpdateExpression: 'SET SHORTLISTED_UNIVERSITIES = list_append(SHORTLISTED_UNIVERSITIES, :university)',
        ExpressionAttributeValues: {
            ":university": [university]   
        }
    };

    try {
        const data = await dynamodb.send(new UpdateCommand(params));
        console.log("Success - item added or updated", data);
        return buildResponse(200, data);
    } catch (err) {
        console.error("There is an error: ", err);
        return buildResponse(403, {
            message: err
        });
    }
}

export default addShortlist;