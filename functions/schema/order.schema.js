const Joi = require('joi');

const addOrderSchema = Joi.object().keys({
    serviceid: Joi.string().required(),
    subserviceid: Joi.string().required(),
    serviceproviderid: Joi.string().required()
});
const removeOrderSchema = Joi.object().keys({
    orderid: Joi.string().required(),
    suborderid: Joi.string().required(),
});

const scheduleOrder = Joi.object().keys({
    orderid: Joi.string().required(),
    dateandtime: Joi.date().iso().required(),
    userid: Joi.string().required(),
    payment: Joi.boolean().required()
});

module.exports = {
    addOrderSchema,
    removeOrderSchema,
    scheduleOrder
}
