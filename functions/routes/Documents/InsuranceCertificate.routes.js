const SchemaValidator = require("../../middlewares/schemaValidator");
const validateRequest = SchemaValidator(true);
const vehicleRegistrationController = require("../../controllers/Documents/vehicleRegistration.controller")
const TokenHandler = require("../../middlewares/tokenHandler")

module.exports = (router) => {
    router.post('/vehicleinspection/addInsuranceCert', TokenHandler.authenticateToken, validateRequest, vehicleRegistrationController.rateLimiter, vehicleRegistrationController.addInsuranceCert)
}