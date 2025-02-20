const SchemaValidator = require('../../middlewares/schemaValidator');
const validateRequest = SchemaValidator(true);
const RegistrationController = require("../../authentication/registration.controller")
const loginController = require("../../authentication/login.controller")

module.exports = authentication => {
    authentication.post('/sms/registration', validateRequest, RegistrationController.sendRegistrationSms)
    authentication.post('/register', validateRequest, RegistrationController.registration)
    authentication.post('/login', validateRequest, loginController.login)
}