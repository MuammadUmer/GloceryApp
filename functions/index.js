/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// require("dotenv").config()
const functions = require("firebase-functions");

var admin = require("firebase-admin");

var opra = require("./private/xridesdev-firebase-adminsdk-6fj33-95ea5d6a38.json");

admin.initializeApp({
    credential: admin.credential.cert(opra)
});

const express = require("express");


const app = new express();

const cors = require("cors")

app.use(cors())





app.get("/getSecret", async (req, res) => {
    // console.log(require("crypto").randomBytes(64).toString("hex"))
    console.log(req.body)
    return res.status(200).send(tokenhandler.generateToken({ username: "muhammadumer", id: "abc1234", email: "" }))
})

const tokenhandler = require("./middlewares/tokenHandler")
app.get("/testing", async (req, res) => {
    // console.log(require("crypto").randomBytes(64).toString("hex"))
    // console.log(require("dotenv").config())
    // return res.status(200).send(tokenhandler.generateToken({ username: "muhammadumer", id: "abc1234", email: "muhammadumerswati@gmail.com" }))
    let row1 = [4, 9, 2];
    let row2 = [3, 5, 7];
    let row3 = [8, 1, 6];
    let loshu = [row1, row2, row3];
    combinedArray(loshu)
    return res.status(200).send("ok")

})
function combinedArray(loshu){
    let finalArray = [];
    loshu.forEach(doc => {
        doc.forEach(data=>{
            finalArray.push(data)
        })
    })
    console.log(finalArray)
}

require('./routes')(app);
require("./routes/smartservices.routes")(app)
// require("./routes/authentication.routes")(app)
require("./routes/search.routes")(app)
require("./routes/order.routes")(app)
require("./routes/usersetting.routes")(app)
require("./routes/riderrequest.routes")(app)
// require("./routes/Documents/driverLicense.routes")(app)
// require("./routes/Documents/vehicle.routes")(app)
exports.glocery = functions.region("europe-west2").https.onRequest(app);

