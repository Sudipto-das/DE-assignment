// Middleware to check token
const jwt = require("jsonwebtoken");
const secret= 'hello-sudipto123'
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, secret, (err, user) => {
          if (err) {
            return res.sendStatus(403);
          }
          req.user = user;
          
          next();
        });
      } else {
        res.sendStatus(401);
      }
};
module.exports = {auth,secret}