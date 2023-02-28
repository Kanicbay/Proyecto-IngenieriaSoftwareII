const jwt = require('jsonwebtoken');
require ('dotenv').config();


const tokenSign = async (user) => {
    return jwt.sign(
        {
            _id: user.cliente,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '2h',
        }
    )
}

const verifyToken = async (token) => {
    try{
        return await jwt.verify(token, process.env.JWT_SECRET);
    }
    catch(err){
        return null;
    }
}

module.exports = {
    tokenSign,
    verifyToken
}

