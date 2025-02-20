// Asim baby bacground check is just single node for concent does not need controller //ignore for now
// please do not make controller for profile photo, background check //ignore for now
// driver License is required before any other document. This will speed up the approval process when we need to cross-check your license with other documents.

// const profilePhotoSchema = Joi.object({
//     photo: Joi.string().base64().required()
// });

// const backgroundCheckSchema = Joi.object({
//     consent: Joi.boolean().required(),
//     backgroundCheckDocument: Joi.string().base64().required()
// });

let driverRequirement = {
    "requiredDocuments": {
        "driverLicense": {
            "description": "A valid driver's license for the state you are driving in",
            "required": true
        },
        "proofOfInsurance": {
            "description": "An insurance document showing that your vehicle is insured",
            "required": true
        },
        "vehicleRegistration": {
            "description": "Proof that your vehicle is registered in the state where you will be driving",
            "required": true
        },
        "profilePhoto": {
            "description": "A clear, recent photograph of yourself",
            "required": true
        },
        "backgroundCheck": {
            "description": "Consent to a background check, which will review your criminal and driving history",
            "required": true
        },
        "vehicleInspection": {
            "description": "A document proving that your vehicle has passed a safety inspection",
            "required": true
        },
        "optionalDocuments": {
            "proofOfResidency": {
                "description": "Utility bills or other documents that prove you reside in the area you will be driving",
                "required": false
            },
            "businessLicense": {
                "description": "In some cities, drivers may need a business license",
                "required": false
            },
            "vehicleSafetyInspectionForm": {
                "description": "Completed by a certified mechanic, confirming the vehicle meets Uber's safety requirements",
                "required": false
            }
        }
    }
}


// 7/9/2024

// structure under progress

// configurations (collection)
//   - configId (document)
//     - fuelPrice
//     - farePerKm

// drivers (collection)
//   - driverId (document)
//     - location: { latitude, longitude }
//     - status: "available" / "unavailable"
//     - city: "specificCity"


// rides (collection)
//   - rideId (document)
//     - userId
//     - source: { latitude, longitude }
//     - vehiclePreferences
//     - driverId
//     - status: "booked" / "completed"
// drivers (collection)
//   - driverId (document)
//     - location: { latitude, longitude }
//     - status: "available" / "unavailable"
//     - vehicleType
//     - city: "specificCity"

// 7/10/2024
// sedanDrivers (collection)
//   - driverId (document)
//     - location: { latitude, longitude }
//     - status: "available" / "unavailable"
//     - city: "specificCity"
    
// suvDrivers (collection)
//   - driverId (document)
//     - location: { latitude, longitude }
//     - status: "available" / "unavailable"
//     - city: "specificCity"
    
// hatchbackDrivers (collection)
//   - driverId (document)
//     - location: { latitude, longitude }
//     - status: "available" / "unavailable"
//     - city: "specificCity"
    
// luxuryDrivers (collection)
//   - driverId (document)
//     - location: { latitude, longitude }
//     - status: "available" / "unavailable"
//     - city: "specificCity"
    
// minivanDrivers (collection)
//   - driverId (document)
//     - location: { latitude, longitude }
//     - status: "available" / "unavailable"
//     - city: "specificCity"
    
// vanDrivers (collection)
//   - driverId (document)
//     - location: { latitude, longitude }
//     - status: "available" / "unavailable"
//     - city: "specificCity"
    
// coupeDrivers (collection)
//   - driverId (document)
//     - location: { latitude, longitude }
//     - status: "available" / "unavailable"
//     - city: "specificCity"
    
// convertibleDrivers (collection)
//   - driverId (document)
//     - location: { latitude, longitude }
//     - status: "available" / "unavailable"
//     - city: "specificCity"
    
// pickupTruckDrivers (collection)
//   - driverId (document)
//     - location: { latitude, longitude }
//     - status: "available" / "unavailable"
//     - city: "specificCity"
    
// electricDrivers (collection)
//   - driverId (document)
//     - location: { latitude, longitude }
//     - status: "available" / "unavailable"
//     - city: "specificCity"
    
// hybridDrivers (collection)
//   - driverId (document)
//     - location: { latitude, longitude }
//     - status: "available" / "unavailable"
//     - city: "specificCity"

// Stucture
// Multiple Vehicles
// privateCredential/userkey/vehicles/new doc
// Case 1: if it already exist by registration number then error else add. 
// Case 2: if vehicle type is same then replace existing vehicle else disable/delete the others

// Registration/Login
// Should be common if user want to switch between apps then he will be redirected to that stack