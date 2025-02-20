const { db, rateLimit, timeStampNow } = require("../../model/common")
const { responseMessage, responseError } = require("../../model/responsemessage")
const { uploadImage } = require("../Images/images.controller")
const privateCredential = db.collection('privateCredential')

const rateLimiter = rateLimit({
    windowMs: 60 * 60 * 500,
    max: 60,
    message:
        "Too many login attempts from this IP, please try again after half an hour"
});

const addVehicleRegistration = async (req, res) => {
    try {
        // Add the license data to the "License" collection
        // uploading image to correct path
        //path is user base asim so we dont need to save the image path but we will upload then to storage
        uploadImage(registrationDocument, `vehicleRegistration/${req.user.userkey}/registrationDocument`)
        delete req.body.registrationDocument
        // console.log(req.user);
        // console.log(req.body);
        req.body.createdAt = timeStampNow()
        privateCredential.doc(req.user.userkey).collection('documents').doc("vehicleRegistration").set(req.body);

        // Send a success response
        return responseMessage(res, 201, 'Vehicle registration added successfully', null)
    } catch (error) {
        console.error('Error adding Vehicle registration:', error);
        return responseError(res, "Error adding Vehicle registration", error)
    }
};

// Arrow function to handle updating a license
const updateVehicleRegistration = async (req, res) => {
    // const { oldlicenseNumber } = req.params; // Extract licenseNumber from URL parameters
    const { licenseNumber, dateOfExpirey, dataOfIssue, Name } = req.body;

    try {
        // Query to find the document by licenseNumber
        // const querySnapshot = await db.collection('License')
        //     .where('licenseNumber', '==', oldlicenseNumber)
        //     .get();

        // NO need to seach the document as this is specific to one user
        const querySnapshot = await privateCredential.doc(req.user.userkey).collection('documents').doc("vehicleRegistration").get()

        if (querySnapshot.exists) {
            // Assume licenseNumber is unique, so update the first (and only) matched document  // now it is only one record
            if (req.body.registrationDocument) {
                uploadImage(req.body.registrationDocument, `driverLicense/${req.user.userkey}/registrationDocument`)
                delete req.body.registrationDocument
            }
            req.body.updatedAt = timeStampNow()
            // Update the document
            querySnapshot.ref.update(req.body);

            // Send a success response
            return responseMessage(res, 200, 'Vehicle registration updated successfully', null)
        } else {
            return responseMessage(res, 404, 'Vehicle registration not found', null)
        }


    } catch (error) {
        console.error('Error updating Vehicle registration:', error);
        return responseError(res, "Error updating Vehicle registration", error)
    }
};

// Arrow function to handle deleting a license
const deleteVehicleRegistration = async (req, res) => {

    try {
        // Query to delete the document 
        privateCredential.doc(req.user.userkey).collection('documents').doc("vehicleRegistration").delete()

        // Send a success response
        return responseMessage(res, 200, 'Vehicle registration deleted successfully', null)
    } catch (error) {
        console.error('Error deleting Vehicle registration:', error);
        return responseError(res, "Error deleting Vehicle registration", error)
    }
};
//documents addition for vehicle registration
const addPhvlDocument = async (req, res) => {
    console.log(req.body);
    try {
        req.body.userKey = req.user.userkey
        req.body.ReviewStatus = "Pending";
        // req.body.createdAt = timeStampNow()
        privateCredential.doc(req.user.userkey).collection("vehicles").doc(req.body.licensePlate).get().then(ref => {
            if (ref.exists) {
                return responseMessage(res, 200, 'Vehicle already exist', null)
            } else {
                privateCredential.doc(req.user.userkey)
                .collection("vehicles")
                .doc(req.body.licensePlate)
                .collection("PhvlDocument")
                .add(req.body)
                .then(docRef => {
                    docRef.update({ isPhvDocumentSubmitted: true });
                })
                .catch(error => {
                    console.error("Error adding document: ", error);
                });
                return responseMessage(res, 201, 'Vehicle added successfully', null) // Send a success response
            }
        })
    } catch (error) {
        console.error('Error adding vehicle:', error);
        return responseError(res, "Error adding vehicle", error)
    }
};

const addMotCertDocument = async (req, res) => {
    console.log(req.body);
    try {
        req.body.userKey = req.user.userkey
        req.body.ReviewStatus = "Pending";
        // req.body.createdAt = timeStampNow()        
                privateCredential.doc(req.user.userkey)
                .collection("vehicles")
                .doc(req.body.licensePlate)
                .collection("MotCertDocument")
                .add(req.body)
                .then(docRef => {
                    docRef.update({ isMotCertSubmitted: true });
                })
                .catch(error => {
                    console.error("Error adding document: ", error);
                });
                return responseMessage(res, 201, 'MotCertificate document added successfully', null) // Send a success response
    } catch (error) {
        console.error('Error adding document:', error);
        return responseError(res, "Error adding docuemnt", error)
    }
};


const addV5cBookKeeper = async (req, res) => {
    console.log(req.body);
    try {
        req.body.userKey = req.user.userkey
        req.body.ReviewStatus = "Pending";
        // req.body.createdAt = timeStampNow()

        
                privateCredential.doc(req.user.userkey)
                .collection("vehicles")
                .doc(req.body.licensePlate)
                .collection("V5cBookKeeper")
                .add(req.body)
                .then(docRef => {
                    docRef.update({ isV5cBookKeeperSubmitted: true });
                })
                .catch(error => {
                    console.error("Error adding document: ", error);
                });
                return responseMessage(res, 201, 'V5cBookKeeper document added successfully', null) // Send a success response
    } catch (error) {
        console.error('Error adding document:', error);
        return responseError(res, "Error adding docuemnt", error)
    }
};

const addInsuranceCert = async (req, res) => {
    console.log(req.body);
    try {
        req.body.userKey = req.user.userkey
        req.body.ReviewStatus = "Pending";
        // req.body.createdAt = timeStampNow()

        
                privateCredential.doc(req.user.userkey)
                .collection("vehicles")
                .doc(req.body.licensePlate)
                .collection("InsuranceCert")
                .add(req.body)
                .then(docRef => {
                    docRef.update({ isInsuranceCertSubmitted: true });
                })
                .catch(error => {
                    console.error("Error adding document: ", error);
                });
                return responseMessage(res, 201, 'InsuranceCert document added successfully', null) // Send a success response
    } catch (error) {
        console.error('Error adding document:', error);
        return responseError(res, "Error adding docuemnt", error)
    }
};


module.exports = {
    rateLimiter,
    addVehicleRegistration,
    updateVehicleRegistration,
    deleteVehicleRegistration,
    addPhvlDocument,
    addInsuranceCert,
    addMotCertDocument,
    addV5cBookKeeper
}