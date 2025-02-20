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

const addVehicleInspection = async (req, res) => {

    // const { licensePictureFront, licensePictureBack, licenseNumber, dateOfExpirey, dataOfIssue, Name } = req.body;
    // Abc
    try {
        // Add the license data to the "License" collection
        // uploading image to correct path
        //path is user base asim so we dont need to save the image path but we will upload then to storage
        uploadImage(inspectionDocument, `vehicleInspection/${req.user.userkey}/inspectionDocument`)
        delete req.body.inspectionDocument
        // console.log(req.user);
        // console.log(req.body);
        req.body.createdAt = timeStampNow()
        privateCredential.doc(req.user.userkey).collection('documents').doc("vehicleInspection").set(req.body);

        // Send a success response
        return responseMessage(res, 201, 'Vehicle inspection added successfully', null)
    } catch (error) {
        console.error('Error adding Vehicle inspection:', error);
        return responseError(res, "Error adding Vehicle inspection", error)
    }
};

// Arrow function to handle updating a license
const updateVehicleInspection = async (req, res) => {
    try {

        // NO need to seach the document as this is specific to one user
        const querySnapshot = await privateCredential.doc(req.user.userkey).collection('documents').doc("vehicleInspection").get()

        if (querySnapshot.exists) {
            // Assume licenseNumber is unique, so update the first (and only) matched document  // now it is only one record
            if (req.body.inspectionDocument) {
                uploadImage(inspectionDocument, `vehicleInspection/${req.user.userkey}/inspectionDocument`)
                delete req.body.licensePictureFront
            }
            req.body.updatedAt = timeStampNow()
            // Update the document
            querySnapshot.ref.update(req.body);

            // Send a success response
            return responseMessage(res, 200, 'Vehicle inspection updated successfully', null)
        } else {
            return responseMessage(res, 404, 'Vehicle inspection not found', null)
        }


    } catch (error) {
        console.error('Error updating vehicle inspection:', error);
        return responseError(res, "Error updating vehicle inspection", error)
    }
};

// Arrow function to handle deleting a license
const deleteInspection = async (req, res) => {
    try {
        // Deleting if exist or not, no need for verification
        privateCredential.doc(req.user.userkey).collection('documents').doc("vehicleInspection").delete()
        return responseMessage(res, 200, 'Vehicle inspection deleted successfully', null)
    } catch (error) {
        console.error('Error deleting vehicle inspection:', error);
        return responseError(res, "Error deleting vehicle inspecttion", error)
    }
};

module.exports = {
    rateLimiter,
    addVehicleInspection,
    updateVehicleInspection,
    deleteInspection
}