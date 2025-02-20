const SchemaValidator = require("../../middlewares/schemaValidator");
const validateRequest = SchemaValidator(true);
const insuranceController = require("../../controllers/Documents/proofOfInsurance.controller")
const TokenHandler = require("../../middlewares/tokenHandler")

module.exports = (router) => {
    router.post('/insurance/add', TokenHandler.authenticateToken, validateRequest, insuranceController.rateLimiter, insuranceController.addInsurance)
    router.delete('/insurance/delete', TokenHandler.authenticateToken, validateRequest, insuranceController.rateLimiter, insuranceController.deleteInsurance)
    router.post('/insurance/update', TokenHandler.authenticateToken, validateRequest, insuranceController.rateLimiter, insuranceController.updateInsurance)
}