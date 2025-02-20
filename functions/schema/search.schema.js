const Joi = require('joi');

const searchSchema = Joi.object().keys({
    location: Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required(),
        choice: Joi.boolean().required(),
        meter: Joi.number().required()
    }).required(),
    subcatagoryid: Joi.string().max(20).required(),
    catagoryid: Joi.string().max(20).required(),
    ratings: Joi.object({
        min: Joi.number().max(9).required(),
        max: Joi.number().max(10).required()
    }).required(),
    price: Joi.object({
        min: Joi.number().min(1).required(),
        max: Joi.number().required()
    }).required()
});

module.exports = {
    searchSchema
}
