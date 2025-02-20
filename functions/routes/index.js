const express = require('express');

module.exports = (app) => {
    // Authentication
    require('./Authentication')(app);
    // Document Routes
    require('./Documents')(app);
    //Vehicles
    require('./Vehicles')(app);


    // const authenticationRouter = require('express').Router();
    // authenticationRoutes(authenticationRouter);

    // app.use('/api/authentication', authenticationRouter);
};