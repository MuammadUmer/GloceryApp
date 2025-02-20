const { db, rateLimit, timeStampNow } = require("../../model/common")
const { responseMessage, responseError } = require("../../model/responsemessage")
const privateCredential = db.collection('privateCredential')
// const privateVehicle = db.collection('vehicle')

const rateLimiter = rateLimit({
    windowMs: 60 * 60 * 500,
    max: 60,
    message:
        "Too many login attempts from this IP, please try again after half an hour"
});

const addVehicle = async (req, res) => {
    console.log(req.body);
    try {
        req.body.userKey = req.user.userkey
        // req.body.createdAt = timeStampNow()
        console.log(req.user.userkey)
        privateCredential.doc(req.user.userkey).collection("vehicles").doc(req.body.licensePlate).get().then(ref => {
            if (ref.exists) {
                return responseMessage(res, 200, 'Vehicle already exist', null)
            } else {
                privateCredential.doc(req.user.userkey).collection("vehicles").doc(req.body.licensePlate).set(req.body)
                return responseMessage(res, 201, 'Vehicle added successfully', null) // Send a success response
            }
        })
    } catch (error) {
        console.error('Error adding vehicle:', error);
        return responseError(res, "Error adding vehicle", error)
    }
};

// Arrow function to handle updating a vehicle
const updateVehicle = async (req, res) => {
    // const { oldlicenseNumber } = req.params; // Extract licenseNumber from URL parameters
    // const { make, model, year, color, licensePlate, vin } = req.body.vehicleInfo;

    // const { minimumDoors, minimumSeatbelts, vehicleCondition, validRegistration, noAdvertising, noSalvageTitle, allowedVehiclesList, disallowedVehiclesList, childSeatAvailable } = req.body.commonRequirements;

    try {
        // Query to find the document by licenseNumber
        // const querySnapshot = await db.collection('Vehicle')
        //     .where('licenseNumber', '==', oldlicenseNumber)
        //     .get();

        // NO need to seach the document as this is specific to one user
        const querySnapshot = await privateVehicle.doc(req.user.userkey).get()

        if (querySnapshot.exists) {
            // Assume licenseNumber is unique, so update the first (and only) matched document  // now it is only one record
            // req.body.updatedAt = timeStampNow()
            querySnapshot.ref.update(req.body);
            // Send a success response
            return responseMessage(res, 200, 'Vehicle updated successfully', null)
        } else {
            return responseMessage(res, 404, 'Vehicle not found', null)
        }


    } catch (error) {
        console.error('Error updating vehicle:', error);
        return responseError(res, "Error updating vehicle", error)
    }
};

// Mark documents as verfied
const markVehicleVerfication = async (req, res) => {
    try {
        // Query to find the document by licenseNumber

        // NO need to seach the document as this is specific to one user
        const querySnapshot = await privateVehicle.doc(req.params.userKey).get()

        if (querySnapshot.exists) {
            // Assume licenseNumber is unique, so update the first (and only) matched document  // now it is only one record
            req.body.verificationTime = Timestamp.now()
            req.body.updateTime = Timestamp.now()
            req.body.updatedBy = req.user.userKey
            req.body.verificationStatus = "Verified"
            querySnapshot.ref.update(req.body);
            // Send a success response
            return responseMessage(res, 200, 'Vehicle verified successfully', null)
        } else {
            return responseMessage(res, 404, 'Vehicle not found', null)
        }

    } catch (error) {
        console.error('Error updating vehicle:', error);
        return responseError(res, "Error updating vehicle", error)
    }
};

// Arrow function to handle deleting a vehicle
const deleteVehicle = async (req, res) => {
    const { licenseNumber } = req.params; // Extract licenseNumber from URL parameters

    try {

        privateVehicle.doc(req.user.userkey).delete()

        // Send a success response
        return responseMessage(res, 200, 'Vehicle deleted successfully', null)
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        return responseError(res, "Error deleting vehicle", error)
    }
};

module.exports = {
    rateLimiter,
    addVehicle,
    updateVehicle,
    deleteVehicle
}

// const vehicleRequirements = {
//     common: {
//         minimumDoors: 4,
//         minimumSeatbelts: 5,
//         vehicleCondition: 'decent',
//         validRegistration: true,
//         noAdvertising: true,
//         noSalvageTitle: true,
//     },
//     floridaSpecific: {
//         validRegistration: true, // Already covered in common
//     },
//     uber: {
//         maxVehicleAge: 15,
//         allowedVehicleList: [], // Populate with specific allowed vehicles
//         disallowedVehicleList: [] // Populate with specific disallowed vehicles
//     },
//     lyft: {
//         minVehicleYear: 2010,
//         allowedVehicleList: [], // Populate with specific allowed vehicles
//         disallowedVehicleList: [] // Populate with specific disallowed vehicles
//     },
//     suv: {
//         minimumSeatbelts: 8
//     }
// };
// const vehicleRequirements = {
//     common: {
//         minimumDoors: 4,
//         minimumSeatbelts: 5,
//         vehicleCondition: 'decent',
//         validRegistration: true,
//         noAdvertising: true,
//         noSalvageTitle: true,
//     },
//     floridaSpecific: {
//         validRegistration: true, // Already covered in common
//     },
//     uber: {
//         maxVehicleAge: 15,
//         allowedVehicleList: [], // Populate with specific allowed vehicles
//         disallowedVehicleList: [] // Populate with specific disallowed vehicles
//     },
//     lyft: {
//         minVehicleYear: 2010,
//         allowedVehicleList: [], // Populate with specific allowed vehicles
//         disallowedVehicleList: [] // Populate with specific disallowed vehicles
//     },
//     suv: {
//         minimumSeatbelts: 8
//     }
// };
