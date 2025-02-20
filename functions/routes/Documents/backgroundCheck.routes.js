const SchemaValidator = require("../../middlewares/schemaValidator");
const validateRequest = SchemaValidator(true);
const backgroundCheckController = require("../../controllers/Documents/backgroundCheck.controller")
const TokenHandler = require("../../middlewares/tokenHandler")

module.exports = (router) => {
    router.post('/backgroundCheck/add', TokenHandler.authenticateToken, validateRequest, backgroundCheckController.rateLimiter, backgroundCheckController.addBackgroundCheck)
    router.post('/backgroundCheck/update', TokenHandler.authenticateToken, validateRequest, backgroundCheckController.rateLimiter, backgroundCheckController.updateBackgroundCheck)
    router.delete('/backgroundCheck/delete', TokenHandler.authenticateToken, validateRequest, backgroundCheckController.rateLimiter, backgroundCheckController.deleteBackgroundCheck)
}