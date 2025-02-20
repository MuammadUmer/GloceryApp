const express = require('express');
const driverLicenseRoutes = require('./driverLicense.routes');
const proofOfinsuranceRoutes = require('./proofOfInsurance.routes');
const backgroundCheckRoutes = require('./backgroundCheck.routes');
const vehicleInspectionRoutes = require('./vehicleInspection.routes');
const vehicleRegistrationRoutes = require('./vehicleRegistration.routes');
const motTestCertificateRoutes = require('./motTestCertificate.routes');
const v5cBookKeeperRoutes = require('./v5cBookKeeper.routes');
const phvlDocumentRoutes = require('./phvlDocument.routes');
const insuranceCertificate = require('./InsuranceCertificate.routes');

module.exports = (app) => {
    //Document Routes
    const documentsRouter = express.Router();
    backgroundCheckRoutes(documentsRouter)
    driverLicenseRoutes(documentsRouter)
    proofOfinsuranceRoutes(documentsRouter)
    vehicleInspectionRoutes(documentsRouter)
    vehicleRegistrationRoutes(documentsRouter)
    motTestCertificateRoutes(documentsRouter)
    // v5cBookKeeperRoutes(documentsRouter) // commened because of error
    phvlDocumentRoutes(documentsRouter)
    insuranceCertificate(documentsRouter)
    app.use('/documents', documentsRouter);


    // const authenticationRouter = require('express').Router();
    // authenticationRoutes(authenticationRouter);

    // app.use('/api/authentication', authenticationRouter);
};