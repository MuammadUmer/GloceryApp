const functions = require("firebase-functions");
var admin = require("firebase-admin");
var db = admin.firestore();
const { responseMessage, responseError } = require("../../model/responsemessage")
const rateLimit = require("express-rate-limit");

const addUserSettingRateLimiter = rateLimit({
    windowMs: 60 * 60 * 500,
    max: 10,
    message:
        "Too many login attempts from this IP, please try again after half an hour"
});


const addUserSetting = async (req, res) => {
    try {
        if (req.body.workinghours.open < req.body.workinghours.close) {
            db.collection('userSetting').doc(req.user.userkey).set(req.body, { merge: true })
            return responseMessage(res, 201, "Setting has been saved successfully", null)
        }else{
            return responseMessage(res, 422, "Opening time must be less than closing", null)
        }

    } catch (error) {
        return console.log("error inside add user schedule function => ", error)
    }
}

const updateUserSchedule = async (req, res) => {

}

module.exports = {
    addUserSettingRateLimiter,
    addUserSetting,

}