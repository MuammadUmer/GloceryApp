const { responseMessage, responseError } = require("../model/responsemessage")
const { db, rateLimit, bcrypt, timeStampNow, generateText, datesDifference } = require("../model/common")
const privateCredential = db.collection('privateCredential')
const registrationOTP = db.collection('registrationOTP')
var { sendSmsWithMessage } = require("../controllers/Communications/sendsmsonphone.controller");
const saltRounds = 10;

const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 500, // 1 hour window = 1000
    max: 5, // start blocking after 5 requests
    message: "Too many accounts created from this IP, please try again after half an hour"
});

const registration = async (req, res) => {
    try {
        // const refemail = privateCredential.where('email', '==', req.body.email).get()
        const refphone = privateCredential.where('phone', '==', req.body.phone).get()
        const refotp = registrationOTP.doc(req.body.phone).get()
        // let password = generateText({ length: 8, numbers: true })
        // const refhash = bcrypt.hash(password, saltRounds)
        const refhash = bcrypt.hash(req.body.password, saltRounds)

        // Promise.all([refemail, refphone, refotp, refhash]).then(values => {
        Promise.all([refphone, refotp, refhash]).then(values => {
            if (values[0].empty) {
                if (values[1].exists) {
                    if (values[1].data().otp === req.body.otp) {
                        // let password = generatePassword()
                        // bcrypt.hash(password, saltRounds)
                        // bcrypt.hash(password, saltRounds, function (err, hash) {
                        console.log(values[2])
                        req.body.password = values[2]
                        db.collection('privateCredential').add({ ...req.body, createdTime: timeStampNow() })
                        // sendPasswordOnEmail(password)
                        registrationOTP.doc(req.body.phone).delete()
                        // });
                        return responseMessage(res, 201, "Registration successfull", null)
                    } else {
                        if (values[1].data().count === 1) {
                            registrationOTP.doc(req.body.phone).delete()
                            return responseMessage(res, 400, "Invalid Otp", null)
                        }
                        else {
                            registrationOTP.doc(req.body.phone).update({
                                count: values[1].data().count - 1
                            })
                            return responseMessage(res, 400, "Invalid Otp", null)
                        }
                    }
                } else {
                    return responseMessage(res, 400, "Invalid Otp", null)
                }
            } else {
                return responseMessage(res, 400, "Phone already exist!", null)
            }
        })
    } catch (error) {
        console.log("error inside registration", error)
        return responseError(res, "Error Registration", error)
    }
}

const sendPasswordOnEmail = (password) => {
    console.log("Passowrd has been sent on email " + password)
}

const sendRegistrationSms = async (req, res) => {
    try {
        var otp = generateText({ length: 6, numbers: true, uppercase: false, lowercase: false })
        registrationOTP.doc(req.body.phone).get().then(ref => {
            if (ref.exists) {
                let difference = datesDifference(new Date(), ref.data().time.toDate(), 'seconds')
                if (difference > 60) {
                    registrationOTP.doc(req.body.phone).set({
                        ...req.body,
                        otp,
                        count: 3,
                        time: timeStampNow()
                    })
                    sendSmsWithMessage(req.body.phone, "OTP for Xrides is " + otp)
                    return responseMessage(res, 200, "Otp has been send to phone!", null)
                } else
                    return responseMessage(res, 200, `Please wait for another ${60 - difference} seconds`, null)
            } else {
                registrationOTP.doc(req.body.phone).set({
                    ...req.body,
                    otp,
                    count: 3,
                    time: timeStampNow()
                })
                sendSmsWithMessage(req.body.phone, "OTP for Xrides is " + otp)
                return responseMessage(res, 200, "Otp has been send to phone!", null)
            }
        })
    } catch (error) {
        console.log("error inside sendRegistrationSms", error)
        return responseError(res, "Error Send Registration Sms", error)
    }
}
module.exports = {
    registration,
    sendRegistrationSms,
    createAccountLimiter,
}