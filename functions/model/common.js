var textGenerator = require('generate-password');
var moment = require('moment');
var admin = require("firebase-admin");
var db = admin.firestore();
var rateLimit = require("express-rate-limit");
var { Timestamp } = require("firebase-admin/firestore");
var bcrypt = require('bcrypt');
const axios = require('axios');
const haversine = require('haversine-distance');
const { distanceBetween, geohashQueryBounds } = require("geofire-common");

const generateText = (options) => {
    return textGenerator.generate(options).toString();
}

const datesDifference = (date1, date2, option) => {
    return moment(date1).diff(moment(date2), option)
}

const timeStampNow = () => {
    return Timestamp.now()
}
const radiusInMeter = (source, destination) => {
    return haversine(source, destination);
}
const radiusInKM = (source, destination) => {
    return haversine(source, destination) / 1000;
}

module.exports = {
    db,
    rateLimit,
    bcrypt,
    generateText,
    datesDifference,
    timeStampNow,
    axios,
    radiusInMeter,
    distanceBetween,
    geohashQueryBounds
}