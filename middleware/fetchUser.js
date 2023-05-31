const jwt = require('jsonwebtoken')

const fetchUser = async (req, res, next) => {
    try {
        const token = req.header('auth-token')
        if (!token) {
            res.status(401).send({ error: "Please authenticate using a valid token" })
        }
        else {
            const data = jwt.verify(token, process.env.SECRET_KEY)
            // console.log(data.user);
            req.user = data.user
            next()
        }
    } catch (err) {
        console.log(err);
    }
}
module.exports = fetchUser