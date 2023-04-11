import jwt from 'jsonwebtoken';

function generateToken(userInfo) {
    if (!userInfo) {
        return null;
    }

    return jwt.sign(userInfo, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
}

export function verifyToken(email, token) {
    return jwt.verify(token, process.env.JWT_SECRET, (error, response) => {
        if (error) {
            return {
                verified: false,
                message: "invalid token"
            };
        }
        else if (response.EMAIL !== email) {
            return {
                verified: false,
                message: "invalid user"
            };
        }
        else {
            return {
                verified: true,
                message: "verified"
            };
        }
    });
}

export default generateToken;