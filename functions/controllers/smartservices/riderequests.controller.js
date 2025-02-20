// require("dotenv").config({ path: path.join(__dirname, "../../private/.env") });
const { db, rateLimit, timeStampNow, axios, radiusInMeter, distanceBetween, geohashQueryBounds } = require("../../model/common");
const { responseMessage, responseError } = require("../../model/responsemessage")

const intialRadius1 = 1500; // 1500 meters
const intialRadius2 = 5000; // 5000 meters

const rateLimiter = rateLimit({
    windowMs: 60 * 60 * 500,
    max: 60,
    message:
        "Too many login attempts from this IP, please try again after half an hour"
});


// const addRiderRequests = async (req, res) => {

//     try {
//         // Add the license data to the "License" collection
//         console.log(req.user);
//         console.log(req.body);
//         req.body.createdAt = timeStampNow();
//         req.body.IsOrderValid = true;

//         db.collection('smartservices').doc(req.user.userkey).collection("riderequests").add(req.body);

//         // Send a success response
//         return responseMessage(res, 201, 'ride requests added successfully', null)
//     } catch (error) {
//         console.error('Error adding ride requests:', error);
//         return responseError(res, "Error adding ride requests", error)
//     }
// };

const bookRide = async (req, res) => {

    const { pickup_latitude, pickup_longitude, pickup_address, dropoff_latitude, dropoffp_longitude, dropoff_address, vehiclePreferences, userId, childSeatAvailable, expandRadius } = req.body;
    const center = [pickup_latitude, pickup_longitude];

    const radius1 = intialRadius1; // 1500 meters
    const radius2 = intialRadius2; // 5000 meters
    if (expandRadius) {

    }

    const bounds1 = geohashQueryBounds(center, radius1);
    const bounds2 = geohashQueryBounds(center, radius2);

    // all Drivers sorted with radius1 and radius2
    let allDrivers = [];
    // driver who are not available but was available at time of query
    let checkedDrivers = new Set();

    async function fetchDrivers() {
        for (const vehicleType of vehiclePreferences) {
            const collectionName = `${vehicleType}Drivers`;
            const promises = [];

            for (const b of bounds1) {
                let q = db.collection(collectionName).where('status', '==', 'available').orderBy('geohash').startAt(b[0]).endAt(b[1]);
                if (childSeatAvailable) {
                    q = q.where('childSeatAvailable', '==', true);
                }
                promises.push(q.get());
            }

            for (const b of bounds2) {
                let q = db.collection(collectionName).where('status', '==', 'available').orderBy('geohash').startAt(b[0]).endAt(b[1]);
                if (childSeatAvailable) {
                    q = q.where('childSeatAvailable', '==', true);
                }
                promises.push(q.get());
            }

            const snapshots = await Promise.all(promises);

            snapshots.forEach(snap => {
                snap.forEach(doc => {
                    allDrivers.push({ id: doc.id, ...doc.data() });
                });
            });
        }
    }

    await fetchDrivers();

    if (allDrivers.length === 0) {
        return res.status(200).json({ message: "No suitable driver found." });
    }

    function findBestDriver() {
        let bestDriver = null;
        allDrivers.forEach(driverData => {
            if (checkedDrivers.has(driverData.id)) {
                return; // Skip already checked drivers
            }
            const driverLocation = [driverData.location.latitude, driverData.location.longitude];
            const distanceInMeters = distanceBetween(center, driverLocation) * 1000; // Convert to meters

            // Check if this driver is the closest found so far
            if (distanceInMeters <= radius2 && (!bestDriver || distanceInMeters < bestDriver.distance)) {
                bestDriver = { driverId: driverData.id, ...driverData, distance: distanceInMeters };
            }
        });
        return bestDriver;
    }

    let bestDriver = findBestDriver();

    if (!bestDriver) {
        return res.status(200).json({ message: "No suitable driver found." });
    }

    const rideRef = db.collection('rides').doc();
    let driverBooked = false;
    let attempts = 0;
    const maxAttempts = 5; // Limit to avoid infinite loop

    while (!driverBooked && attempts < maxAttempts) {
        attempts += 1;
        const driverRef = db.collection(`${bestDriver.vehicleType}Drivers`).doc(bestDriver.driverId);

        try {
            await db.runTransaction(async (transaction) => {
                const driverDoc = await transaction.get(driverRef);
                if (driverDoc.data().status === 'unavailable') {
                    throw new Error('Driver already booked');
                }

                transaction.update(driverRef, { status: 'unavailable' });
                transaction.set(rideRef, {
                    userId,
                    source: { latitude, longitude },
                    vehiclePreferences,
                    driverId: bestDriver.driverId,
                    status: 'booked'
                });

                driverBooked = true;
            });
        } catch (error) {
            if (error.message === 'Driver already booked') {
                checkedDrivers.add(bestDriver.driverId); // Mark this driver as checked
                bestDriver = findBestDriver(); // Find the next best driver

                if (!bestDriver) {
                    return res.status(200).json({ message: "No suitable driver found." });
                }
            } else {
                return res.status(500).json({ message: "Internal server error" });
            }
        }
    }

    if (!driverBooked) {
        return res.status(200).json({ message: "No suitable driver found." });
    }

    res.status(200).json({ message: "Driver booked successfully", driver: bestDriver });
};

// Costly method
const bookRideWithMaps = async (req, res) => {
    const schema = Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        vehiclePreferences: Joi.array().items(Joi.string().valid('sedan', 'suv', 'hatchback', 'luxury', 'minivan', 'van', 'coupe', 'convertible', 'pickupTruck', 'electric', 'hybrid')).required(),
        userId: Joi.string().required(),
        childSeatAvailable: Joi.boolean().optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { latitude, longitude, vehiclePreferences, userId, childSeatAvailable } = value;
    const center = [latitude, longitude];
    const radius1 = 1500; // 1500 meters
    const radius2 = 5000; // 5000 meters

    const bounds1 = geohashQueryBounds(center, radius1);
    const bounds2 = geohashQueryBounds(center, radius2);
    let allDrivers = [];
    let checkedDrivers = new Set();

    async function fetchDrivers() {
        for (const vehicleType of vehiclePreferences) {
            const collectionName = `${vehicleType}Drivers`;
            const promises = [];

            for (const b of bounds1) {
                let q = db.collection(collectionName).where('status', '==', 'available').orderBy('geohash').startAt(b[0]).endAt(b[1]);
                if (childSeatAvailable) {
                    q = q.where('childSeatAvailable', '==', true);
                }
                promises.push(q.get());
            }

            for (const b of bounds2) {
                let q = db.collection(collectionName).where('status', '==', 'available').orderBy('geohash').startAt(b[0]).endAt(b[1]);
                if (childSeatAvailable) {
                    q = q.where('childSeatAvailable', '==', true);
                }
                promises.push(q.get());
            }

            const snapshots = await Promise.all(promises);

            snapshots.forEach(snap => {
                snap.forEach(doc => {
                    allDrivers.push({ id: doc.id, ...doc.data() });
                });
            });
        }
    }

    await fetchDrivers();

    if (allDrivers.length === 0) {
        return res.status(200).json({ message: "No suitable driver found." });
    }

    // Function to get travel duration using Google Maps Distance Matrix API
    async function getTravelDuration(driverLocation) {
        const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
        const origin = `${latitude},${longitude}`;
        const destination = `${driverLocation.latitude},${driverLocation.longitude}`;
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            if (response.data.status === 'OK' && response.data.rows.length > 0 && response.data.rows[0].elements.length > 0) {
                return response.data.rows[0].elements[0].duration.value; // Return duration in seconds
            } else {
                return Infinity; // If API response is not valid, consider infinite duration
            }
        } catch (error) {
            console.error('Error fetching travel duration:', error);
            return Infinity; // Return infinite duration on error
        }
    }

    // Find the best driver considering both distance and travel duration
    function findBestDriver() {
        let bestDriver = null;
        let minDuration = Infinity;

        allDrivers.forEach(driverData => {
            if (checkedDrivers.has(driverData.id)) {
                return; // Skip already checked drivers
            }

            const driverLocation = driverData.location;
            const distanceInMeters = distanceBetween(center, [driverLocation.latitude, driverLocation.longitude]) * 1000; // Convert to meters

            if (distanceInMeters > radius2) {
                return; // Skip drivers outside of the 5000 meters radius
            }

            // Calculate travel duration from client to driver
            getTravelDuration(driverLocation).then(duration => {
                if (duration < minDuration) {
                    minDuration = duration;
                    bestDriver = { driverId: driverData.id, ...driverData, distance: distanceInMeters, travelDuration: duration };
                }
            }).catch(error => {
                console.error('Error calculating travel duration:', error);
            });
        });

        return bestDriver;
    }

    // Wait for travel durations to be calculated for all drivers
    let bestDriver = findBestDriver();

    // Timeout to wait for asynchronous travel duration calculations
    setTimeout(() => {
        if (!bestDriver) {
            return res.status(200).json({ message: "No suitable driver found." });
        }

        const rideRef = db.collection('rides').doc();
        let driverBooked = false;
        let attempts = 0;
        const maxAttempts = 5; // Limit to avoid infinite loop

        // Function to attempt booking the best driver
        async function attemptBooking() {
            attempts += 1;
            const driverRef = db.collection(`${bestDriver.vehicleType}Drivers`).doc(bestDriver.driverId);

            try {
                await db.runTransaction(async (transaction) => {
                    const driverDoc = await transaction.get(driverRef);
                    if (driverDoc.data().status === 'unavailable') {
                        throw new Error('Driver already booked');
                    }

                    transaction.update(driverRef, { status: 'unavailable' });
                    transaction.set(rideRef, {
                        userId,
                        source: { latitude, longitude },
                        vehiclePreferences,
                        driverId: bestDriver.driverId,
                        status: 'booked'
                    });

                    driverBooked = true;
                });
            } catch (error) {
                if (error.message === 'Driver already booked') {
                    checkedDrivers.add(bestDriver.driverId); // Mark this driver as checked
                    bestDriver = findBestDriver(); // Find the next best driver

                    if (!bestDriver) {
                        return res.status(200).json({ message: "No suitable driver found." });
                    }
                } else {
                    return res.status(500).json({ message: "Internal server error" });
                }
            }

            if (!driverBooked && attempts < maxAttempts) {
                attemptBooking(); // Retry booking if not successful and attempts < maxAttempts
            } else {
                if (!driverBooked) {
                    return res.status(200).json({ message: "No suitable driver found." });
                }

                res.status(200).json({ message: "Driver booked successfully", driver: bestDriver });
            }
        }

        attemptBooking(); // Start attempting booking
    }, 5000); // Wait for 5 seconds for travel durations to be calculated

}


const getDrivers = async (req, res) => {
    const { latitude, longitude, city } = req.body;

    const driversRef = db.collection('drivers');
    const snapshot = await driversRef.where('status', '==', 'available').where('city', '==', city).get();

    if (snapshot.empty) {
        return res.status(200).json({ message: "Service is not available here at this moment." });
    }

    const drivers = [];
    const userLocation = { latitude, longitude };

    snapshot.forEach(doc => {
        const driverData = doc.data();
        const driverLocation = driverData.location;

        const distance = radiusInMeter(userLocation, driverLocation);
        if (distance <= 100) {
            drivers.push({ driverId: doc.id, ...driverData });
        }
    });

    res.status(200).json(drivers);
};

// const bookDriver = async (req, res) => {
//     const { latitude, longitude, vehiclePreferences, userId } = req.body;

//     const driversRef = db.collection('drivers');
//     const snapshot = await driversRef
//         .where('status', '==', 'available')
//         .where('vehicleType', 'in', vehiclePreferences)
//         .get();

//     if (snapshot.empty) {
//         return res.status(200).json({ message: "No available drivers found." });
//     }

//     let bestDriver = null;
//     snapshot.forEach(doc => {
//         const driverData = doc.data();
//         const driverLocation = driverData.location;

//         if (!bestDriver) {
//             bestDriver = { driverId: doc.id, ...driverData };
//         }
//         // Add any additional logic to choose the best driver
//     });

//     if (!bestDriver) {
//         return res.status(200).json({ message: "No suitable driver found." });
//     }

//     // Transaction to ensure atomicity
//     const rideRef = db.collection('rides').doc();
//     const driverRef = driversRef.doc(bestDriver.driverId);

//     await db.runTransaction(async (transaction) => {
//         const driverDoc = await transaction.get(driverRef);
//         if (driverDoc.data().status === 'unavailable') {
//             throw new Error('Driver already booked');
//         }

//         transaction.update(driverRef, { status: 'unavailable' });
//         transaction.set(rideRef, {
//             userId,
//             source: { latitude, longitude },
//             vehiclePreferences,
//             driverId: bestDriver.driverId,
//             status: 'booked'
//         });
//     });

//     res.status(200).json({ message: "Driver booked successfully", driver: bestDriver });
// };

const calculateFare = async (req, res) => {
    const { source, destination, country } = req.body;

    const configRef = db.collection('configurations').doc(country);
    const configDoc = await configRef.get();
    if (!configDoc.exists) {
        return res.status(400).json({ message: "Configuration not found" });
    }
    const config = configDoc.data();

    const googleMapsUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${source.latitude},${source.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(googleMapsUrl);

    const distanceInMeters = response.data.rows[0].elements[0].distance.value;
    const durationInSeconds = response.data.rows[0].elements[0].duration.value;

    const distanceInKm = distanceInMeters / 1000;
    const durationInMinutes = durationInSeconds / 60;
    const fare = distanceInKm * config.farePerKm;

    res.status(200).json({
        distance: distanceInKm,
        duration: durationInMinutes,
        fare: fare,
        currency: config.currency // assuming config has currency information
    });
};

module.exports = {
    // addRiderRequests,
    bookRide,
    getDrivers,
    // bookDriver,
    calculateFare,
    rateLimiter
};