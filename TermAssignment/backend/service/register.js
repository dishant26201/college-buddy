import { DynamoDBClient, DynamoDB } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import buildResponse from '../utils/util.js';
import bcrypt from 'bcryptjs';
import generateToken from "../utils/auth.js";

const dynamodb = new DynamoDBClient({ region: "us-east-1" });
const userTable = 'Users';

async function register(userInfo) {

    if (!userInfo.FIRST_NAME || !userInfo.LAST_NAME || !userInfo.EMAIL || !userInfo.PASSWORD || !userInfo.PREFERRED_LOCATIONS || !userInfo.PREFERRED_PROGRAM || !userInfo.GRADE_PERCENTAGE) {
        return buildResponse(401, {
            message: "All fields are required."
        });
    }

    const FIRST_NAME = userInfo.FIRST_NAME;
    const LAST_NAME = userInfo.LAST_NAME;
    const EMAIL = userInfo.EMAIL;
    const PASSWORD = userInfo.PASSWORD;
    const PREFERRED_LOCATIONS = userInfo.PREFERRED_LOCATIONS;
    const PREFERRED_PROGRAM = userInfo.PREFERRED_PROGRAM;
    const GRADE_PERCENTAGE = userInfo.GRADE_PERCENTAGE;
    const SHORTLISTED_UNIVERSITIES = [];

    const dynamoUser = await getUser(EMAIL.toLowerCase().trim());
    if (dynamoUser && dynamoUser.EMAIL) {
        return buildResponse(401, {
            message: "An account with this email aready exists in our database."
        });
    }

    const encrypytedPassword = bcrypt.hashSync(PASSWORD.trim(), 10);
    const user = {
        FIRST_NAME: FIRST_NAME,
        LAST_NAME: LAST_NAME,
        EMAIL: EMAIL.toLowerCase(),
        PASSWORD: encrypytedPassword,
        PREFERRED_LOCATIONS: PREFERRED_LOCATIONS,
        PREFERRED_PROGRAM: PREFERRED_PROGRAM,
        GRADE_PERCENTAGE: GRADE_PERCENTAGE,
        SHORTLISTED_UNIVERSITIES: SHORTLISTED_UNIVERSITIES
    };

    const saveUserResponse = await saveUser(user);
    if (saveUserResponse === "User can't be added.") {
        return buildResponse(503, {
            message: "Server error. Please try again later."
        });
    }
    else {
        const userInfo = {
            EMAIL: EMAIL,
            FIRST_NAME: FIRST_NAME,
            LAST_NAME: LAST_NAME
        };
        const token = generateToken(userInfo);
        const response = {
            user: userInfo,
            token: token
        };
        return buildResponse(200, response);
    }
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

async function saveUser(user) {
    const params = {
        TableName: userTable,
        Item: user
    };
    try {
        const data = await dynamodb.send(new PutCommand(params));
        return "User added.";
    } catch (err) {
        return "User can't be added."
    }
}

export default register;
