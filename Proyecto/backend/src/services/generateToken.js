const jwt = require('jsonwebtoken');

const tokenSign = async (user) => {
    return jwt.sign(
        {
            _id: user._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '2h',
        }
    )
}

const verifyToken = async (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}