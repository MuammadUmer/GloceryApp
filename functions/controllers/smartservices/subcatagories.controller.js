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

const addSubCatagory = async (req, res) => {
    req.body.name = req.body.name.toLowerCase()
    const ref = await db.collection('catgories').doc(req.body.catagoryid).collection('subcatagories').where('name', '==', req.body.name).get()
    if (ref.empty) {
        db.collection('catgories').doc(req.body.catagoryid).collection('subcatagories').add(req.body)
        return responseMessage(res, 201, "SubCatagory added sucessfully", null);
    } else {
        return responseMessage(res, 400, "Subcatagory already exist", null);
    }
}

const getSubCatagory = async (req, res) => {
    // if(req.params.catagoryid)
    const ref = await db.collection('catgories').doc(req.params.catagoryid).collection('subcatagories').get()
    if (!ref.empty) {
        let response = [];
        ref.forEach(doc => {
            let tmpobject = doc.data()
            tmpobject.id = doc.id
            response.push(tmpobject)
        })
        return responseMessage(res, 201, "Subcatagory retrieved successfully", response);
    } else {
        return responseMessage(res, 200, "Subcatagory are empty", null);
    }
}

module.exports = {
    rateLimiter,
    addSubCatagory,
    getSubCatagory
}