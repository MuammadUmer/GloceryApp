const Joi = require('joi');

const vehicleSafetyInspectionFormSchema = Joi.object({
    mechanicName: Joi.string().required(),
    inspectionDate: Joi.date().required(),
    inspectionForm: Joi.string().base64().required()
});

module.exports = {
    vehicleSafetyInspectionFormSchema,
}