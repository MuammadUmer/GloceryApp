const express = require('express');
const driverAuthentication = require('./driver.routes');
const consumerAuthentication = require('./consumer.routes');


module.exports = (app) => {
    // Driver Auth Router
    const driverAuthRouter = express.Router();
    driverAuthentication(driverAuthRouter);
    app.use('/driver', driverAuthRouter);

    // Consumer Auth Router
    const consumerAuthRouter = express.Router();
    consumerAuthentication(consumerAuthRouter);
    app.use('/consumer', consumerAuthRouter);

    // const authenticationRouter = require('express').Router();
    // authenticationRoutes(authenticationRouter);

    // app.use('/api/authentication', authenticationRouter);
};