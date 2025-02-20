const { responseMessage, responseError } = require("../../model/responsemessage")
const { db, rateLimit, timeStampNow } = require("../../model/common")
const { uploadImage } = require("../Images/images.controller")
const privateCredential = db.collection('privateCredential')

const rateLimiter = rateLimit({
    windowMs: 60 * 60 * 500,
    max: 60,
    message:
        "Too many login attempts from this IP, please try again after half an hour"
});

const addBackgroundCheck = async (req, res) => {

    // const { licensePictureFront, licensePictureBack, licenseNumber, dateOfExpirey, dataOfIssue, Name } = req.body;
    // Abc
    try {
        // Add the license data to the "License" collection
        // uploading image to correct path
        //path is user base asim so we dont need to save the image path but we will upload then to storage
        uploadImage(licensePictureFront, `driverLicense/${req.user.userkey}/licensePictureFront`)
        uploadImage(licensePictureBack, `driverLicense/${req.user.userkey}/licensePictureBack`)
        delete req.body.licensePictureFront
        delete req.body.licensePictureBack
        console.log(req.user);
        console.log(req.body);
        req.body.createdAt = timeStampNow()
        privateCredential.doc(req.user.userkey).collection('documents').doc("backgroundCheck").set(req.body);

        // Send a success response
        return responseMessage(res, 201, 'Background check added successfully', null)
    } catch (error) {
        console.error('Error adding Vehicle inspection:', error);
        return responseError(res, "Error adding Vehicle inspection", error)
    }
};

// Arrow function to handle updating a license
const updateBackgroundCheck = async (req, res) => {
    // const { oldlicenseNumber } = req.params; // Extract licenseNumber from URL parameters
    const { licenseNumber, dateOfExpirey, dataOfIssue, Name } = req.body;

    try {
        // Query to find the document by licenseNumber
        // const querySnapshot = await db.collection('License')
        //     .where('licenseNumber', '==', oldlicenseNumber)
        //     .get();

        // NO need to seach the document as this is specific to one user
        const querySnapshot = await privateCredential.doc(req.user.userkey).collection('documents').doc("backgroundCheck").get()

        if (querySnapshot.exists) {
            // Assume licenseNumber is unique, so update the first (and only) matched document  // now it is only one record
            if (req.body.licensePictureFront) {
                uploadImage(req.body.licensePictureFront, `driverLicense/${req.user.userkey}/licensePictureFront`)
                delete req.body.licensePictureFront
            }
            if (req.body.licensePictureBack) {
                uploadImage(req.body.licensePictureFront, `driverLicense/${req.user.userkey}/licensePictureBack`)
                delete req.body.licensePictureBack
            }
            req.body.updatedAt = timeStampNow()
            // Update the document
            querySnapshot.ref.update(req.body);

            // Send a success response
            return responseMessage(res, 200, 'Background check updated successfully', null)
        } else {
            return responseMessage(res, 404, 'Background check not found', null)
        }


    } catch (error) {
        console.error('Error updating Background check:', error);
        return responseError(res, "Error updating Background check", error)
    }
};

// Arrow function to handle deleting a license
const deleteBackgroundCheck = async (req, res) => {
    // const { licenseNumber } = req.params; // Extract licenseNumber from URL parameters

    try {
        // Query to find the document by licenseNumber
        // const querySnapshot = await db.collection('License')
        //     .where('licenseNumber', '==', licenseNumber)
        //     .get();

        privateCredential.doc(req.user.userkey).collection('documents').doc("backgroundCheck").delete()

        // if (querySnapshot.empty) {
        //     return res.status(404).json({ message: 'License not found' });
        // }

        // Assume licenseNumber is unique, so delete the first (and only) matched document
        // const docRef = querySnapshot.docs[0].ref;

        // Delete the document
        // await docRef.delete();

        // Send a success response
        return responseMessage(res, 200, 'Background check deleted successfully', null)
    } catch (error) {
        console.error('Error deleting Background Check:', error);
        return responseError(res, "Error deleting Background check", error)
    }
};

module.exports = {
    rateLimiter,
    addBackgroundCheck,
    updateBackgroundCheck,
    deleteBackgroundCheck
}