const { responseMessage, responseError } = require("../model/responsemessage")
const { db, rateLimit, bcrypt, timeStampNow } = require("../model/common")
const tokenhandler = require("../middlewares/tokenHandler")
const privateCredential = db.collection('privateCredential')
const unauthorizedMessage = "Username or password is incorrect"
const successfullMessage = "Login Sucessfull"

const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 500, // 1 hour window
    max: 10, // start blocking after 5 requests
    message:
        "Too many login attempts from this IP, please try again after half an hour"
});


// Drivers/Consumers Login
const login = async (req, res) => {
    try {
        const refphone = await privateCredential.where('phone', '==', req.body.username).get()
        if (!refphone.empty) {
            let userdata = refphone.docs[0].data()
            userdata.userkey = refphone.docs[0].id
            bcrypt.compare(req.body.password, userdata.password).then(function (result) {
                if (result) {
                    responseMessage(res, 200, successfullMessage, tokenhandler.generateToken(userdata))
                    privateCredential.doc(userdata.userKey).update({
                        loginAt: timeStampNow()
                    })
                }
                else
                    responseMessage(res, 401, unauthorizedMessage, null)
            });
        } else {
            responseMessage(res, 401, unauthorizedMessage, null)
        }

    } catch (error) {
        console.log("error inside login function ", error)
        return responseError(res, "Error login", error)
    }
}

// Employee Login Pending

module.exports = {
    login,
    loginLimiter
}