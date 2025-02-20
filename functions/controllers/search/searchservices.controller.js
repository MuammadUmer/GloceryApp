const functions = require("firebase-functions");
var admin = require("firebase-admin");
var db = admin.firestore();
const { responseMessage, responseError } = require("../../model/responsemessage")
const rateLimit = require("express-rate-limit");
const geofire = require('geofire-common')

const rateLimiter = rateLimit({
    windowMs: 60 * 60 * 500,
    max: 100,
    message:
        "Too many login attempts from this IP, please try again after half an hour"
});

const servicesSubCatagoryId = async (req, res) => {
    try {

        const center = [34.375679, 73.262772];
        const radiusInM = 1 * req.body.location.meter; 
        
        // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
        // a separate query for each pair. There can be up to 9 pairs of bounds
        // depending on overlap, but in most cases there are 4.
        const bounds = geofire.geohashQueryBounds(center, radiusInM);
        const promises = [];
        // console.log(bounds)
        for (const b of bounds) {
          const q = db.collectionGroup('services').where("catagoryid","==",req.body.catagoryid).where("subcatagoryid","==",req.body.subcatagoryid)
            .orderBy('geohash')
            .startAt(b[0])
            .endAt(b[1]);
        
          promises.push(q.get());
        }
        // console.log(promises)
        
        // Collect all the query results together into a single list
        Promise.all(promises).then((snapshots) => {
          const matchingDocs = [];
        
          for (const snap of snapshots) {
            for (const doc of snap.docs) {
              const lat = doc.get('lat');
              const lng = doc.get('lng');
              // We have to filter out a few false positives due to GeoHash
              // accuracy, but most will match
              const distanceInKm = geofire.distanceBetween([lat, lng], center);
              const distanceInM = distanceInKm * 1000;
              if (distanceInM <= radiusInM) {
                matchingDocs.push(doc.data());
              }
            }
          }
        
          return matchingDocs;
        }).then((matchingDocs) => {
          // Process the matching documents
          // ...
          responseMessage(res, 200, "Data retrieved successfully", matchingDocs)
        });


        // const ref = await db.collectionGroup('services').where('subcatagoryid', '==', 'cBfcupffjiWrAPxYJc3j').get();
        // if (ref.empty) {
        //     console.log('Nothing to display');
        //     console.log(ref)
        //     res.sendStatus(202)
        // }
        // else {
        //     let response = [];
        //     ref.forEach(doc => {
        //         // console.log(doc.ref.path)
        //         response.push({...doc.data(),serviceid:doc.id})
        //     })
        //     responseMessage(res, 200, "Data retrieved successfully", response)
        // }
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    rateLimit,
    servicesSubCatagoryId
}