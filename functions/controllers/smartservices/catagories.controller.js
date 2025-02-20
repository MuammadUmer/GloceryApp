const functions = require("firebase-functions");
var admin = require("firebase-admin");
var db = admin.firestore();
const { responseMessage, responseError } = require("../../model/responsemessage")
const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
    windowMs: 60 * 60 * 500,
    max: 100,
    message:
        "Too many login attempts from this IP, please try again after half an hour"
});

const addCatagory = async (req, res) => {
    req.body.name = req.body.name.toLowerCase()
    const ref = await db.collection('catgories').where('name', '==', req.body.name).get()
    if (ref.empty) {
        db.collection('catgories').add(req.body);
        return responseMessage(res, 201, "Catagory added sucessfully", null);
    } else {
        return responseMessage(res, 400, "Catagory already exist", null);
    }
}

const getCatagory = async (req, res) => {
    const ref = await db.collection('catgories').get()
    if (!ref.empty) {
        let response = [];
        ref.forEach(doc => {
            let tmpobject = doc.data()
            tmpobject.id = doc.id
            response.push(tmpobject)
        })
        return responseMessage(res, 200, "Catagory retrieved successfully", response);
    } else {
        return responseMessage(res, 204, "Catagory are empty", null);
    }
}

module.exports = {
    rateLimiter,
    addCatagory,
    getCatagory
}