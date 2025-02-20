const SchemaValidator = require('../middlewares/schemaValidator');
const validateRequest = SchemaValidator(true);
const searchController = require('../controllers/search/searchservices.controller')
const TokenHandler = require("../middlewares/tokenHandler")
module.exports = authentication => {

    // Search Service
    authentication.post("/search/services", validateRequest, searchController.servicesSubCatagoryId)

}