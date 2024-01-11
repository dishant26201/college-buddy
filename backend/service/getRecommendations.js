import { PersonalizeRuntimeClient, GetPersonalizedRankingCommand, GetRecommendationsCommand } from "@aws-sdk/client-personalize-runtime";
import buildResponse from '../utils/util.js';

const personalizeRuntimeClient = new PersonalizeRuntimeClient({ region: "us-east-1"});

async function getRecommendations(getRecommendationsBody) {
    const getRecommendationsParam = {
        campaignArn: 'arn:aws:personalize:us-east-1:917983641996:campaign/recommendation-campaign1',
        userId: getRecommendationsBody.EMAIL, 
        numResults: 15  
    }

    try {
        const response = await personalizeRuntimeClient.send(new GetRecommendationsCommand(getRecommendationsParam));
        console.log("Success!", response);
        return buildResponse(200, response);
    } 
    catch (err) {
        console.log("Error", err);
        return buildResponse(403, {
            message: err
        });
    }

}

export default getRecommendations;