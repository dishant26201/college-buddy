import buildResponse from '../utils/util.js';
import generateToken, { verifyToken } from '../utils/auth.js';

function verify(requestBody) {
    if (!requestBody.user || !requestBody.user.EMAIL || !requestBody.token) {
        return buildResponse(401, {
            verfied: false,
            message: 'incorrect request body'
        });
    }

    if (!requestBody.user.EMAIL) {
        return buildResponse(401, {
            verfied: false,
            message: 'incorrect request body'
        });
    }

    const user = requestBody.user;
    const token = requestBody.token;
    
    const verification = verifyToken(user.EMAIL, token);
    if (verification.verified) {
        return buildResponse(200, {
            verified: true,
            message: 'success',
            user: user,
            token: token
        });
    }
    else {
        return buildResponse(401, verification);
    }
}

export default verify;