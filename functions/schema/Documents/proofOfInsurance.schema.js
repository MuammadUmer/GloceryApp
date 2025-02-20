const Joi = require('joi');

const proofOfInsuranceSchema = Joi.object({
    policyNumber: Joi.string().required(),
    expiryDate: Joi.date().required(),
    insuranceDocument: Joi.string().base64().required()
});

// const proofOfInsuranceSchema = Joi.object({
//     policyNumber: Joi.string().required(),
//     expiryDate: Joi.date().required(),
//     insuranceType: Joi.string().valid('private hire', 'public hire', 'courier', 'personal').required(),
//     insuredVehicle: Joi.object({
//         make: Joi.string().required(),
//         model: Joi.string().required(),
//         registrationNumber: Joi.string().required()
//     }).required(),
//     insuranceDocument: Joi.string().base64().required()
// });


module.exports = {
    proofOfInsuranceSchema,
}