const Joi = require('joi');

const businessLicenseSchema = Joi.object({
    licenseNumber: Joi.string().required(),
    expiryDate: Joi.date().required(),
    licenseDocument: Joi.string().base64().required()
});


module.exports = {
    businessLicenseSchema,
}