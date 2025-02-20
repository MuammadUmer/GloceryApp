const Joi = require('joi');

const vehicleRegistrationSchema = Joi.object({
    bodyType: Joi.string().valid('hatchback', 'sedan', 'suv', 'coupe', 'convertible', 'wagon', 'van', 'truck').required(),
    make: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().integer().min(2010).required(), // Assuming cars don't exist before 2010
    color: Joi.string().required(),
    licensePlate: Joi.string().custom((value, helpers) => {
        // Convert to lowercase and remove all spaces
        const normalized = value.toLowerCase().replace(/\s+/g, '');
        if (!/^[a-z0-9]+$/.test(normalized)) {
            return helpers.message('Invalid license plate');
        }
        return normalized;
    }).required(),
    vin: Joi.string().length(17).required(), // Standard VIN length is 17 characters
    minimumDoors: Joi.number().integer().min(4).required(),
    minimumSeatbelts: Joi.number().integer().min(5).required(),
    vehicleCondition: Joi.string().valid('decent').required(),
    validRegistration: Joi.boolean().required(),
    noAdvertising: Joi.boolean().required(),
    noSalvageTitle: Joi.boolean().required(),
    childSeatAvailable: Joi.boolean().required()
});

// const vehicleRegistrationSchema = Joi.object({
//     bodyType: Joi.string().required(),
//     make: Joi.string().required(),
//     model: Joi.string().required(),
//     year: Joi.number().integer().min(2010).required(), // Assuming cars don't exist before 2010
//     color: Joi.string().required(),
//     licensePlate: Joi.string().lowercase().required(),
//     vin: Joi.string().length(17).required(), // Standard VIN length is 17 characters
//     minimumDoors: Joi.number().integer().min(4).required(),
//     minimumSeatbelts: Joi.number().integer().min(5).required(),
//     vehicleCondition: Joi.string().valid('decent').required(),
//     validRegistration: Joi.boolean().required(),
//     noAdvertising: Joi.boolean().required(),
//     noSalvageTitle: Joi.boolean().required(),
//     allowedVehiclesList: Joi.array().items(Joi.string()).required(),
//     disallowedVehiclesList: Joi.array().items(Joi.string()).required(),
//     childSeatAvailable: Joi.boolean().required(),
// suvRequirements: Joi.object({
//     minimumSeatbelts: Joi.number().integer().min(8).required()
// }).required()
// });

const vehicleRegistrationUpdateSchema = Joi.object({
    vehicleInfo: Joi.object({
        make: Joi.string().required(),
        model: Joi.string().required(),
        year: Joi.number().integer().min(2010).required(), // Assuming cars don't exist before 2010
        color: Joi.string().required(),
        licensePlate: Joi.string().required(),
        vin: Joi.string().length(17).required() // Standard VIN length is 17 characters
    }).optional(),
    commonRequirements: Joi.object({
        minimumDoors: Joi.number().integer().min(4).required(),
        minimumSeatbelts: Joi.number().integer().min(5).required(),
        vehicleCondition: Joi.string().valid('decent').required(),
        validRegistration: Joi.boolean().required(),
        noAdvertising: Joi.boolean().required(),
        noSalvageTitle: Joi.boolean().required(),
        allowedVehiclesList: Joi.array().items(Joi.string()).required(),
        disallowedVehiclesList: Joi.array().items(Joi.string()).required(),
        childSeatAvailable: Joi.boolean().required()
    }).required(),
    suvRequirements: Joi.object({
        minimumSeatbelts: Joi.number().integer().min(8).required()
    }).optional()
});

module.exports = {
    vehicleRegistrationSchema,
    vehicleRegistrationUpdateSchema
}
