const Joi = require('joi');

const proofOfResidencySchema = Joi.object({
    documentType: Joi.string().required(),
    document: Joi.string().base64().required()
});



module.exports = {
    proofOfResidencySchema,
}