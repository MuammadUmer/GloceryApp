const Joi = require('joi');

const dvlaDriverLicenseSchema = Joi.object({
    issueDate: Joi.date().required().label('Issue Date'),
    expiryDate: Joi.date().required().label('Expiry Date'),
    picture: Joi.string().uri().required().label('Picture URL')
});

module.exports = {
    dvlaDriverLicenseSchema
}