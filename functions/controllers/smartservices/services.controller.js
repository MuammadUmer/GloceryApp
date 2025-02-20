const functions = require("firebase-functions");
var admin = require("firebase-admin");
var db = admin.firestore();
const { responseMessage, responseError } = require("../../model/responsemessage")
const rateLimit = require("express-rate-limit");
const geofire = require('geofire-common')

const rateLimiter = rateLimit({
    windowMs: 60 * 60 * 500,
    max: 20,
    message:
        "Too many login attempts from this IP, please try again after half an hour"
});

const addService = async (req, res) => {
    try {

        var catgories = db.collection('catgories').doc(req.body.catagoryid).get()
        var subcatagory = db.collection('catgories').doc(req.body.catagoryid).collection('subcatagories').doc(req.body.subcatagoryid).get()
        var servicespromise = db.collection('smartservices').doc(req.user.userkey).collection('services').where('subcatagoryid', '==', req.body.subcatagoryid).get();
        // var userlocation = await db
        const lat = 34.367528
        const lng = 73.263728
        const geohash = geofire.geohashForLocation([lat, lng]);
        console.log(geohash)

        Promise.all([catgories, subcatagory, servicespromise]).then(values => {
            if (!values[0].exists)
                return responseMessage(res, 400, "Invalid catagory id", null)
            if (!values[1].exists)
                return responseMessage(res, 400, "Invalid subcatagory id", null)
            if (values[2].empty) {
                const timestamp = admin.firestore.FieldValue.serverTimestamp()
                var body = req.body;
                body.catagoryname = values[0].data().name
                body.subcatagoryname = values[1].data().name
                body.userid = req.user.userkey
                body.firstname = req.user.firstname
                body.lastname = req.user.lastname
                body.geohash = geohash
                body.timestamp = timestamp
                db.collection('smartservices').doc(req.user.userkey).collection('services').add(req.body)
                return responseMessage(res, 200, "Service added successfully", null);
            } else {
                return responseMessage(res, 400, "Same service already exist in your profile", null);
            }

        });

    } catch (error) {
        console.log('error inside addService ==>> ', error)
    }
}

const getService = async (req, res) => {
    try {
        let response = [];
        const ref = await db.collection('smartservices').doc(req.user.userkey).collection('services').get()
        if (!ref.empty) {
            ref.forEach(doc => {
                var tmp = doc.data()
                tmp.serviceid = doc.id;
                response.push(tmp)
            })
            return responseMessage(res, 200, "Service returned successfully", response);
        } else {
            return responseMessage(res, 400, "You are not providing any service!", null);
        }
    } catch (error) {
        console.log('error inside addService ==>> ', error)
    }
}


const addSubService = async (req, res) => {
    try {
        //  console.log(req.body)

        var refe = db.collection('smartservices').doc(req.user.userkey).collection('services').doc(req.body.serviceid).
            collection('subservices').where('subservicename', '==', req.body.subservicename).get();

        Promise.all([refe]).then(values => {
            if (values[0].empty) {
                db.collection('smartservices').doc(req.user.userkey).collection('services').doc(req.body.serviceid).
                    collection('subservices').add({ ...req.body, createdTime: admin.firestore.FieldValue.serverTimestamp() })
                return responseMessage(res, 200, "Subservice added successfully", null);
            } else {
                return responseMessage(res, 400, "Dupliate name", null);
            }

        });

    } catch (error) {
        console.log('error inside addSubservice ==>> ', error)
    }
}

const getSubService = async (req, res) => {
    try {
        const ref = await db.collection('smartservices').doc(req.user.userkey).collection('services').doc(req.params.serviceid).collection('subservices').get()
        if (!ref.empty) {
            let response = [];
            ref.forEach(doc => {
                var tmpdata = doc.data();
                tmpdata.id = doc.id;
                response.push(tmpdata)
            })
            return responseMessage(res, 200, "Subservices returned successfully", response);
        } else {
            return responseMessage(res, 400, "You are not providing any subservice!", null);
        }
    } catch (error) {
        console.log('error inside get subservices ==>> ', error)
    }
}


module.exports = {
    rateLimiter,
    addService,
    getService,
    addSubService,
    getSubService
}