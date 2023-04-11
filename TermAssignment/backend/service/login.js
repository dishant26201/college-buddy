import { DynamoDBClient, DynamoDB } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import buildResponse from '../utils/util.js';
import generateToken, { verifyToken } from '../utils/auth.js';
import bcrypt from 'bcryptjs';

const dynamodb = new DynamoDBClient({ region: "us-east-1" });
const userTable = 'Users';

async function login(user) {

    if (!user || !user.EMAIL || !user.PASSWORD) {
        return buildResponse(401, {
            message: "EMAIL and EMAIL are required."
        });
    }

    const EMAIL = user.EMAIL;
    const PASSWORD = user.PASSWORD;

    const dynamoUser = await getUser(EMAIL.toLowerCase().trim());
    if (!dynamoUser) {
        return buildResponse(403, {
            message: "User does not exist."
        });
    }

    if (!dynamoUser.EMAIL) {
        return buildResponse(403, {
            message: "User does not exist."
        });
    }
    
    if (!bcrypt.compareSync(PASSWORD, dynamoUser.PASSWORD)) {
        return buildResponse(403, {
            message: "Password is incorrect."
        });
    }

    const userInfo = {
        EMAIL: dynamoUser.EMAIL,
        FIRST_NAME: dynamoUser.FIRST_NAME,
        LAST_NAME: dynamoUser.LAST_NAME,
        GRADE_PERCENTAGE: dynamoUser.GRADE_PERCENTAGE,
        PREFERRED_LOCATIONS: dynamoUser.PREFERRED_LOCATIONS,
        SHORTLISTED_UNIVERSITIES: dynamoUser.SHORTLISTED_UNIVERSITIES,
        PREFERRED_PROGRAM: dynamoUser.PREFERRED_PROGRAM
    };
    const token = generateToken(userInfo);
    const response = {
        user: userInfo,
        token: token
    };
    return buildResponse(200, response);
}

async function getUser(EMAIL) {
    const params = {
        TableName: userTable,
        Key: {
            EMAIL: EMAIL
        }
    };
    try {
        const data = await dynamodb.send(new GetCommand(params));
        return data.Item;
    } catch (err) {
        console.error("There is an error: ", err);
    }
}

export default login;