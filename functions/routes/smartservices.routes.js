const SchemaValidator = require("../middlewares/schemaValidator");
const validateRequest = SchemaValidator(true);
const CatagoryController = require("../controllers/smartservices/catagories.controller")
const SubCatagoriesController = require("../controllers/smartservices/subcatagories.controller")
const servicesController = require("../controllers/smartservices/services.controller")
const TokenHandler = require("../middlewares/tokenHandler")

module.exports = smartservices => {

    // CATAGORIES
    smartservices.post('/catagories', TokenHandler.authenticateToken, validateRequest, CatagoryController.rateLimiter, CatagoryController.addCatagory)
    smartservices.get('/catagories', TokenHandler.authenticateToken, CatagoryController.rateLimiter, CatagoryController.getCatagory)

    // SUBCATAGORIES
    smartservices.post('/subcatagories', TokenHandler.authenticateToken, validateRequest, SubCatagoriesController.rateLimiter, SubCatagoriesController.addSubCatagory)
    smartservices.get('/subcatagories/:catagoryid', TokenHandler.authenticateToken, SubCatagoriesController.rateLimiter, SubCatagoriesController.getSubCatagory)

    // SERVICES
    smartservices.post('/services', TokenHandler.authenticateToken, validateRequest, servicesController.rateLimiter, servicesController.addService)
    smartservices.get('/services', TokenHandler.authenticateToken, servicesController.rateLimiter, servicesController.getService)

    // SUBSERVICES
    smartservices.post('/subservices', TokenHandler.authenticateToken, validateRequest, servicesController.rateLimiter, servicesController.addSubService)
    smartservices.get('/subservices/:serviceid', TokenHandler.authenticateToken, servicesController.rateLimiter, servicesController.getSubService)


}