const path = require("path");
const jwt = require("jsonwebtoken");
const loginresponseschema = require("../schema/tokengeneration.schemas");
// require("dotenv").config({ path: path.join(__dirname, "../private/.env") });

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).send({
        stutus: 401, message: "Unauthorized"
    });
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        // console.log("err iside validation",err)
        // console.log("user iside validation",user)
        if (err) return res.status(403).send({ stutus: 403, message: "Forbidden" });
        req.user = user;

        next();
    });
};

exports.generateToken = (userData) => {
    const checkData = loginresponseschema.loginResponseSchema.validate(userData, { allowUnknown: true, stripUnknown: true });
    // console.log(checkData)
    if (checkData.error) {
        console.log("Some serious issue in generating token, please check the user Data");
        return "System internal error, please be patience it will be resolved within 20 minutes";
    } else {
        checkData.value.TOKEN_SECRET = jwt.sign(checkData.value, process.env.TOKEN_SECRET, { expiresIn: "180000000000000s" });
        return checkData.value;
    }
};

