const authenticationModule = require("./authentication.schema");
const categoryModule = require("./categories.schema");
const servicesModule = require("./services.schema");
const searchModule = require("./search.schema");
const orderModule = require("./order.schema");
const userScheduleModule = require("./userSetting.schema");
const driverLicense = require("./Documents/driverLicense.schema");
const vehicleModule = require("./vehicle.schema");
const rideRequestModule = require("./rideRequest.schema");
const insuranceCertificate = require("./Documents/insuranceCertificate.schema");
const motTestCertificate = require("./Documents/motTestCertificate.schema");
const phvlDocument = require("./Documents/phvlDocument.schema");
const v5cBookKeeper = require("./Documents/v5cBookKeeper.schema");

module.exports = {
    user: {
        "/sms/registration": authenticationModule.registrationSmsSchema,
        "/register": authenticationModule.registrationSchema,
        "/login": authenticationModule.loginSchema,
    },
    categories: {
        "/": categoryModule.categorySchema,
        "/subcategories": categoryModule.subCategorySchema,
    },
    services: {
        "/": servicesModule.addServiceSchema,
        "/subservices": servicesModule.addSubServiceSchema,
    },
    search: {
        "/services": searchModule.searchSchema,
    },
    order: {
        "/add": orderModule.addOrderSchema,
        "/remove": orderModule.removeOrderSchema,
        "/schedule": orderModule.scheduleOrder,
    },
    userSetting: {
        "/setting": userScheduleModule.addUserSchedule,
    },
    license: {
        "/add": driverLicense.addLicenseSchema,
        "/update": driverLicense.updateLicenseSchema,
    },
    vehicle: {
        "/add": vehicleModule.vehicleRegistrationSchema,
        "/update": vehicleModule.vehicleRegistrationUpdateSchema,
        "/addInsuranceCertificate": vehicleModule.insuranceCertificate,
        "/addMotTestCertificate": vehicleModule.motTestCertificate,
        "/addPhvlDocument": vehicleModule.phvlDocument,
        "/addV5cBookKeeper": vehicleModule.v5cBookKeeper,
    },
    rideRequest: {
        "/": rideRequestModule.rideRequestSchema,
    },
};
