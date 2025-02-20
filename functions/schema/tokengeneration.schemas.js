const Joi = require("joi");
exports.loginResponseSchema = Joi.object().keys({
    userkey: Joi.string().required(),
    name: Joi.string().required(),
    // email: Joi.string().email().required(),
    phone: Joi.string().required(),
    // firstname: Joi.string().required(),
    // middlename: Joi.string(),
    // lastname: Joi.string().required(),
    // country: Joi.string().required(),
    // streetaddress: Joi.string().required(),
});