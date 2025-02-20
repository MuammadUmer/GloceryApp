const Joi = require('joi');

const registrationSchema = Joi.object().keys({
    // email: Joi.string().lowercase().email().required(),
    phone: Joi.string().regex(/^\d{3}-\d{3}-\d{4}$/).required(),
    dateofbirth: Joi.date().max('1-1-2004').iso().required(),
    name: Joi.string().required(),
    // cnic: Joi.string().min(13).max(15).required(),
    // servicetype: Joi.string().min(5).max(15).required(),
    address: Joi.string().required(),
    // profilephoto: Joi.string().required(),
    ip: Joi.string().required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    deviceid: Joi.string().required(),
    otp: Joi.string().min(6).required(),
    password: Joi.string().min(8).max(40).required(), // sent on the email
    // firstname: Joi.string().required(),
    // middlename: Joi.string(),
    // lastname: Joi.string().required(),
    // country: Joi.string().required(),
    // city: Joi.string().required(),
    // state: Joi.string().required(),
    // zipcode: Joi.string().required()
});
// Name, phone, address, cnic, service type, ip, lat and long, device id, profile photo, dateofbirth

const registrationSmsSchema = Joi.object().keys({
    phone: Joi.string().regex(/^\d{3}-\d{3}-\d{4}$/).required(),
    ip: Joi.string().required(),
    deviceid: Joi.string().required(),
});

const loginSchema = Joi.object().keys({
    username: Joi.alternatives().try(Joi.string().regex(/^\d{3}-\d{3}-\d{4}$/), Joi.string().lowercase().email()).required(),
    password: Joi.string().min(8).max(40).required(),
});

module.exports = {
    loginSchema,
    registrationSchema,
    registrationSmsSchema
}


