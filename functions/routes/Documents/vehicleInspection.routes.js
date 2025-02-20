const SchemaValidator = require("../../middlewares/schemaValidator");
const validateRequest = SchemaValidator(true);
const vehicleInspectionController = require("../../controllers/Documents/vehicleInspection.controller")
const TokenHandler = require("../../middlewares/tokenHandler")

module.exports = (router) => {
    router.post('/vehicleinspection/add', TokenHandler.authenticateToken, validateRequest, vehicleInspectionController.rateLimiter, vehicleInspectionController.addVehicleInspection)
    router.post('/vehicleinspection/update', TokenHandler.authenticateToken, validateRequest, vehicleInspectionController.rateLimiter, vehicleInspectionController.updateVehicleInspection)
    router.delete('/vehicleinspection/delete', TokenHandler.authenticateToken, validateRequest, vehicleInspectionController.rateLimiter, vehicleInspectionController.deleteInspection)
}