const SchemaValidator = require("../../middlewares/schemaValidator");
const validateRequest = SchemaValidator(true);
const vehicleController = require("../../controllers/Vehicle/vehicle.controller")
const TokenHandler = require("../../middlewares/tokenHandler")

module.exports = vehicle => {
    vehicle.post('/Add', TokenHandler.authenticateToken, validateRequest, vehicleController.rateLimiter, vehicleController.addVehicle)
    vehicle.post('/Update', TokenHandler.authenticateToken, validateRequest, vehicleController.rateLimiter, vehicleController.updateVehicle)
}