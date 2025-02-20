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

const addInsurance = async (req, res) => {
    try {
        // Add the license data to the "License" collection
        // uploading image to correct path
        //path is user base asim so we dont need to save the image path but we will upload then to storage
        uploadImage(insurancePictureFront, `proofOfInsurance/${req.user.userkey}/insurancePictureFront`)
        uploadImage(insurancePictureBack, `proofOfInsurance/${req.user.userkey}/insurancePictureBack`)
        delete req.body.insurancePictureFront
        delete req.body.insurancePictureBack
        console.log(req.user);
        console.log(req.body);
        req.body.createdAt = timeStampNow()
        privateCredential.doc(req.user.userkey).collection('documents').doc("proofOfInsurance").set(req.body);

        // Send a success response
        return responseMessage(res, 201, 'Insurance document added successfully', null)
    } catch (error) {
        console.error('Error adding Insurance document:', error);
        return responseError(res, "Error adding Insurance document", error)
    }
};

// Arrow function to handle updating a license
const updateInsurance = async (req, res) => {
    // const { oldlicenseNumber } = req.params; // Extract licenseNumber from URL parameters
    const { licenseNumber, dateOfExpirey, dataOfIssue, Name } = req.body;

    try {

        const querySnapshot = await privateCredential.doc(req.user.userkey).collection('documents').doc("proofOfInsurance").get()

        if (querySnapshot.exists) {
            // Assume licenseNumber is unique, so update the first (and only) matched document  // now it is only one record
            if (req.body.insurancePictureFront) {
                uploadImage(req.body.insurancePictureFront, `insuranceDoc/${req.user.userkey}/insurancePictureFront`)
                delete req.body.insurancePictureFront
            }
            if (req.body.insurancePictureBack) {
                uploadImage(req.body.insurancePictureFront, `insuranceDoc/${req.user.userkey}/insurancePictureBack`)
                delete req.body.insurancePictureBack
            }
            req.body.updatedAt = timeStampNow()
            // Update the document
            querySnapshot.ref.update(req.body);

            // Send a success response
            return responseMessage(res, 200, 'Insurance document updated successfully', null)
        } else {
            return responseMessage(res, 404, 'Insurance document not found', null)
        }


    } catch (error) {
        console.error('Error updating insurance document:', error);
        return responseError(res, "Error updating insurance document", error)
    }
};

// Arrow function to handle deleting a license
const deleteInsurance = async (req, res) => {
    // const { licenseNumber } = req.params; // Extract licenseNumber from URL parameters

    try {
        // Query to delete the document 
        privateCredential.doc(req.user.userkey).collection('documents').doc("proofOfInsurance").delete()

        // Send a success response
        return responseMessage(res, 200, 'insurance document deleted successfully', null)
    } catch (error) {
        console.error('Error deleting insurance document:', error);
        return responseError(res, "Error deleting Insurance document", error)
    }
};

module.exports = {
    rateLimiter,
    addInsurance,
    updateInsurance,
    deleteInsurance
}