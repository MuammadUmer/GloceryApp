const SchemaValidator = require('../middlewares/schemaValidator');
const validateRequest = SchemaValidator(true);
const userScheduleController = require("../controllers/User/setting.controller")
const TokenHandler = require("../middlewares/tokenHandler")


module.exports = authentication => {
    authentication.post('/user/setting',userScheduleController.addUserSettingRateLimiter, TokenHandler.authenticateToken, validateRequest, userScheduleController.addUserSetting)

}