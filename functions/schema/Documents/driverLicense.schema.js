const Joi = require('joi');

const addLicenseSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        county: Joi.string().optional(), // County is optional in the UK
        postcode: Joi.string().pattern(/^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/).required(), // UK postcode format
        country: Joi.string().required()
    }).required(),
    expiryDate: Joi.date().required(),
    licenseNumber: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    licenseFront: Joi.string().base64().required(),
    licenseBack: Joi.string().base64().required()
});
const updateLicenseSchema = Joi.object().keys({
    licenseFront: Joi.string().base64().optional(),
    licenseFront: Joi.string().base64().optional(),
    licenseNumber: Joi.string().optional(),
    dateOfExpirey: Joi.string().optional(),
    dataOfIssue: Joi.string().optional(),
    address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        county: Joi.string().optional(),
        postcode: Joi.string().pattern(/^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/).required(),
        country: Joi.string().required()
    }).optional(),
    Name: Joi.string().optional()
});

module.exports = {
    addLicenseSchema,
    updateLicenseSchema
}