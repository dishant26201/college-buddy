import { DynamoDBClient, DynamoDB } from "@aws-sdk/client-dynamodb";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import buildResponse from '../utils/util.js';

const dynamodb = new DynamoDBClient({ region: "us-east-1" });
const userTable = 'Users';

async function getuser(getuserBody) {
    const params = {
        TableName: userTable,
        Key: {
            EMAIL: getuserBody.email
        }
    };
    try {
        const data = await dynamodb.send(new GetCommand(params));
        return buildResponse(200, data.Item);
    } catch (err) {
        console.error("There is an error: ", err);
        return buildResponse(403, {
            message: "Cannot retrieve user"
        });
    }
}

export default getuser;