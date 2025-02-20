const Joi = require('joi');

const addServiceSchema = Joi.object().keys({
    catagoryid: Joi.string().required(),
    // catagoryname: Joi.string().required(),
    subcatagoryid: Joi.string().required(),
    // subcatagoryname: Joi.string().required(),
    customname: Joi.string().required(),
    description: Joi.string().required(),
    // photos: Joi.array().required()
});

const addSubServiceSchema = Joi.object().keys({
    serviceid: Joi.string().required(),
    subservicename: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    photos: Joi.array().required()
});


module.exports = {
    addServiceSchema,
    addSubServiceSchema
}
