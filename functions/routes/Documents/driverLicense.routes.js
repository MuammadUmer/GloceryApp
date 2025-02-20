const SchemaValidator = require("../../middlewares/schemaValidator");
const validateRequest = SchemaValidator(true);
const LicneseController = require("../../controllers/Documents/driverLicense.controller")
const TokenHandler = require("../../middlewares/tokenHandler")

module.exports = (router) => {
    router.post('/license/add', TokenHandler.authenticateToken, validateRequest, LicneseController.rateLimiter, LicneseController.addLicense)
    router.delete('/license/delete', TokenHandler.authenticateToken, validateRequest, LicneseController.rateLimiter, LicneseController.deleteLicense)
    router.post('/license/update', TokenHandler.authenticateToken, validateRequest, LicneseController.rateLimiter, LicneseController.updateLicense)
}