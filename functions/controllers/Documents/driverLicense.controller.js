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

const addLicense = async (req, res) => {

    // const { licenseFront, licenseBack, licenseNumber, dateOfExpirey, dataOfIssue, Name } = req.body;
    // Abc
    try {
        // Add the license data to the "License" collection
        // uploading image to correct path
        // path is user base asim so we dont need to save the image path but we will upload then to storage
        uploadImage(req.body.licenseFront, `driverLicense/${req.user.userkey}/licenseFront`)
        uploadImage(req.body.licenseBack, `driverLicense/${req.user.userkey}/licenseBack`)
        delete req.body.licenseFront
        delete req.body.licenseBack
        console.log(req.user);
        console.log(req.body);
        req.body.createdAt = timeStampNow()
        privateCredential.doc(req.user.userkey).collection('documents').doc("driverLicense").set(req.body);

        // Send a success response
        return responseMessage(res, 201, 'Driver license added successfully', null)
    } catch (error) {
        console.error('Error adding driver license:', error);
        return responseError(res, "Error adding driver license", error)
    }
};

// Arrow function to handle updating a license
const updateLicense = async (req, res) => {
    // const { oldlicenseNumber } = req.params; // Extract licenseNumber from URL parameters
    const { licenseNumber, dateOfExpirey, dataOfIssue, Name } = req.body;

    try {
        // Query to find the document by licenseNumber
        // const querySnapshot = await db.collection('License')
        //     .where('licenseNumber', '==', oldlicenseNumber)
        //     .get();

        // NO need to seach the document as this is specific to one user
        const querySnapshot = await privateCredential.doc(req.user.userkey).collection('documents').doc("driverLicense").get()

        if (querySnapshot.exists) {
            // Assume licenseNumber is unique, so update the first (and only) matched document  // now it is only one record
            if (req.body.licenseFront) {
                uploadImage(req.body.licenseFront, `driverLicense/${req.user.userkey}/licenseFront`)
                delete req.body.licenseFront
            }
            if (req.body.licenseBack) {
                uploadImage(req.body.licenseBack, `driverLicense/${req.user.userkey}/licenseBack`)
                delete req.body.licenseBack
            }
            req.body.updatedAt = timeStampNow()
            // Update the document
            querySnapshot.ref.update(req.body);

            // Send a success response
            return responseMessage(res, 200, 'Driver license updated successfully', null)
        } else {
            return responseMessage(res, 404, 'Driver license not found', null)
        }


    } catch (error) {
        console.error('Error updating driver license:', error);
        return responseError(res, "Error updating driver license", error)
    }
};

// Arrow function to handle deleting a license
const deleteLicense = async (req, res) => {
    // const { licenseNumber } = req.params; // Extract licenseNumber from URL parameters

    try {
        // Query to find the document by licenseNumber
        // const querySnapshot = await db.collection('License')
        //     .where('licenseNumber', '==', licenseNumber)
        //     .get();

        privateCredential.doc(req.user.userkey).collection('documents').doc("driverLicense").delete()

        // if (querySnapshot.empty) {
        //     return res.status(404).json({ message: 'License not found' });
        // }

        // Assume licenseNumber is unique, so delete the first (and only) matched document
        // const docRef = querySnapshot.docs[0].ref;

        // Delete the document
        // await docRef.delete();

        // Send a success response
        return responseMessage(res, 200, 'Driver license deleted successfully', null)
    } catch (error) {
        console.error('Error deleting driver license:', error);
        return responseError(res, "Error deleting driver license", error)
    }
};

module.exports = {
    rateLimiter,
    addLicense,
    updateLicense,
    deleteLicense
}