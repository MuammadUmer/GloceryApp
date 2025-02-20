const Joi = require("joi");
const addUserSchedule = Joi.object().keys({
    weekdays: Joi.object().keys({
        "monday": Joi.boolean().required(),
        "tuesday": Joi.boolean().required(),
        "wednesday": Joi.boolean().required(),
        "thursday": Joi.boolean().required(),
        "friday": Joi.boolean().required(),
        "saturday": Joi.boolean().required(),
        "sunday": Joi.boolean().required()
    }).required(),
    workinghours: Joi.object().keys({
        "open": Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required(),
        "close": Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required(),
        "lastordertime": Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required()
    }).required(),
    gapbetweenjobs: Joi.number().required(),
    maximumjobsinsingleday: Joi.number().required(),
    ordercancelation: Joi.number().required()
});

const updateUserSchedule = Joi.object().keys({
    weekdays: Joi.object().keys({
        "monday": Joi.boolean(),
        "tuesday": Joi.boolean(),
        "wednesday": Joi.boolean(),
        "thursday": Joi.boolean(),
        "friday": Joi.boolean(),
        "saturday": Joi.boolean(),
        "sunday": Joi.boolean()
    }),
    workinghours: Joi.object().keys({
        "open": Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
        "close": Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
        "lastordertime": Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/)
    }),
    gapbetweenjobs: Joi.number(),
    maximumjobsinsingleday: Joi.number()
});

module.exports = {
    addUserSchedule,
    updateUserSchedule
}