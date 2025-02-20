const Joi = require('joi');

const addMotTestCertificateSchema = Joi.object({
    picture: Joi.string().uri().required().label('Picture URL'),
    vehicleRegistrationNumber: Joi.string().alphanum().required().label('Vehicle Registration Number'),
    vehicleMake: Joi.string().required().label('Vehicle Make'),
    vehicleModel: Joi.string().required().label('Vehicle Model'),
    expiryDate: Joi.date().required().label('Expiry Date')
});

module.exports = {
    addMotTestCertificateSchema
}