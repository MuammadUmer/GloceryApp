const Joi = require('joi');

const v5cLogbookSchema = Joi.object({
    registrationNumber: Joi.string().alphanum().required().label('Registration Number'),
    vehicleMake: Joi.string().required().label('Vehicle Make'),
    vehicleModel: Joi.string().required().label('Vehicle Model'),
    dateOfFirstRegistration: Joi.date().required().label('Date of First Registration'),
    registeredKeeperName: Joi.string().required().label('Registered Keeper\'s Name'),
    picture: Joi.string().uri().required().label('Picture URL')
});

module.exports = {
    v5cLogbookSchema
}