const SchemaValidator = require('../middlewares/schemaValidator');
const validateRequest = SchemaValidator(true);
const RegistrationController = require("../authentication/registration.controller")
const loginController = require("../authentication/login.controller")

module.exports = authentication => {
    authentication.post('/user/sms/registration', validateRequest, RegistrationController.sendRegistrationSms)
    authentication.post('/user/register', validateRequest, RegistrationController.registration)
    authentication.post('/user/login', validateRequest, loginController.login)
}