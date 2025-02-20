const express = require('express');
const vehicleRoutes = require('./vehicle.routes');


module.exports = (app) => {
    // Vehicle Router
    const vehicleRouter = express.Router();
    vehicleRoutes(vehicleRouter);
    app.use('/vehicle', vehicleRouter);

};