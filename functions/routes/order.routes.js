const SchemaValidator = require("../middlewares/schemaValidator");
const validateRequest = SchemaValidator(true);
const OrderController = require("../controllers/smartservices/order.controller")
const TokenHandler = require("../middlewares/tokenHandler")

module.exports = authentication => {
    authentication.post('/order/add', TokenHandler.authenticateToken, validateRequest, OrderController.rateLimiter, OrderController.addOrder)
    authentication.post('/order/remove', TokenHandler.authenticateToken, validateRequest, OrderController.rateLimiter, OrderController.removeSubOrder)
    authentication.get('/order/mylist', TokenHandler.authenticateToken, validateRequest, OrderController.rateLimiter, OrderController.getOrderPlaceByMe)
    authentication.post('/order/schedule', TokenHandler.authenticateToken, validateRequest, OrderController.rateLimiter, OrderController.scheduleOrder)

}