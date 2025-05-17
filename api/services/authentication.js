const JWT = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;


function generateTokenForUser(user) {
    return JWT.sign(
        { username: user.username, email: user.email},
        SECRET_KEY,
        { expiresIn: "7d" }
    );
}


module.exports = {
    generateTokenForUser,

}