const authencationmodule = require("./authentication.schema")
const catagorymodule = require("./catagories.schema")
const servicesmodule = require("./services.schema")
const searchmodule = require("./search.schema")
const ordermodule = require("./order.schema")
const userschedulemodule = require("./userSetting.schema")

module.exports = {
    "/user/sms/registration": authencationmodule.registrationSmsSchema,
    "/user/register": authencationmodule.registrationSchema,
    "/user/login": authencationmodule.loginSchema,
    "/catagories": catagorymodule.catagorySchema,
    "/subcatagories": catagorymodule.subCatagorySchema,
    "/services": servicesmodule.addServiceSchema,
    "/subservices": servicesmodule.addSubServiceSchema,
    "/search/services": searchmodule.searchSchema,
    "/order/add": ordermodule.addOrderSchema,
    "/order/remove": ordermodule.removeOrderSchema,
    "/order/schedule": ordermodule.scheduleOrder,
    "/user/setting": userschedulemodule.addUserSchedule,
}