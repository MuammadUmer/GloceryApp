const Joi = require('joi');

const catagorySchema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
});

const subCatagorySchema = Joi.object().keys({
    catagoryid: Joi.string().required(),
    // catagoryname: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
});

module.exports = {
    catagorySchema,
    subCatagorySchema
}
