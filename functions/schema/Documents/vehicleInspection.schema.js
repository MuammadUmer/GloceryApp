const Joi = require('joi');

const vehicleInspectionSchema = Joi.object({
    inspectionDate: Joi.date().required(),
    inspectionDocument: Joi.string().base64().required()
});

module.exports = {
    vehicleInspectionSchema,
}