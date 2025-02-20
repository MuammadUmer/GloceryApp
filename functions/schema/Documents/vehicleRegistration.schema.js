const Joi = require('joi');

const vehicleRegistrationSchema = Joi.object({
    registrationNumber: Joi.string().required(),
    expiryDate: Joi.date().required(),
    registrationDocument: Joi.string().base64().required()
});

module.exports = {
    vehicleRegistrationSchema,
}