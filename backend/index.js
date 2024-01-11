import buildResponse from './utils/util.js';
import register from './service/register.js';
import login from './service/login.js';
import verify from './service/verify.js';
import getuser from './service/getuser.js';
import deleteShortlist from './service/deleteShortlist.js';
import addShortlist from './service/addShortlist.js';
import getRecommendations from './service/getRecommendations.js';
import emailShortlist from './service/emailShorlist.js';
import addSubscriber from './service/addSubscriber.js';

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';
const getuserPath = '/getuser';
const deleteShortlistPath = '/deleteshortlist';
const addShortlistPath = '/addshortlist';
const getRecommendationsPath = '/getrecommendations';
const emailShortlistPath = '/emailshortlist';
const addSubscriberPath = '/addsubscriber';

export const handler = async(event) => {
    console.log;("Request Event: ", event);
    let response;
    switch (true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = buildResponse(200);
            break;
        
        case event.httpMethod === 'POST' && event.path === registerPath:
            const registerBody = JSON.parse(event.body);
            response = await register(registerBody);
            break; 
            
        case event.httpMethod === 'POST' && event.path === loginPath:
            const loginBody = JSON.parse(event.body);
            response = await login(loginBody);
            break;
            
        case event.httpMethod === 'POST' && event.path === verifyPath:
            const verifyBody = JSON.parse(event.body);
            response = await verify(verifyBody);
            break;

        case event.httpMethod === 'POST' && event.path === getuserPath:
            const getuserBody = JSON.parse(event.body);
            response = await getuser(getuserBody);
            break;

        case event.httpMethod === 'POST' && event.path === deleteShortlistPath:
            const deleteShortlistBody = JSON.parse(event.body);
            response = await deleteShortlist(deleteShortlistBody);
            break;

        case event.httpMethod === 'POST' && event.path === addShortlistPath:
            const addShortlistBody = JSON.parse(event.body);
            response = await addShortlist(addShortlistBody);
            break;

        case event.httpMethod === 'POST' && event.path === getRecommendationsPath:
            const getRecommendationsBody = JSON.parse(event.body);
            response = await getRecommendations(getRecommendationsBody);
            break;

        case event.httpMethod === 'POST' && event.path === emailShortlistPath:
            const emailShortlistBody = JSON.parse(event.body);
            response = await emailShortlist(emailShortlistBody);
            break;

        case event.httpMethod === 'POST' && event.path === addSubscriberPath:
            const addSubscriberBody = JSON.parse(event.body);
            response = await addSubscriber(addSubscriberBody);
            break;
           
        default:
            response = buildResponse(404, "404 Not Found");
    }
    return response;
};