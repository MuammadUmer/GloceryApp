const SchemaValidator = require("../middlewares/schemaValidator");
const validateRequest = SchemaValidator(true);
const riderequestsController = require("../controllers/smartservices/riderequests.controller")
const TokenHandler = require("../middlewares/tokenHandler")

module.exports = riderrquests => {
    riderrquests.post('/riderequests/add', TokenHandler.authenticateToken, validateRequest, riderequestsController.rateLimiter,riderequestsController.bookRide)
}