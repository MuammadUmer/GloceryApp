const Joi = require('joi');

// const rideRequestSchema = Joi.object({
//   request_id: Joi.string().required(), // Unique identifier for the ride request
//   pickup_location: Joi.object({
//     latitude: Joi.number().required(),  // Latitude of the pickup location
//     longitude: Joi.number().required(), // Longitude of the pickup location
//     address: Joi.string().required()    // Address of the pickup location
//   }).required(),
//   dropoff_location: Joi.object({
//     latitude: Joi.number().required(),  // Latitude of the dropoff location
//     longitude: Joi.number().required(), // Longitude of the dropoff location
//     address: Joi.string().required()    // Address of the dropoff location
//   }).required(),
//   distance: Joi.number().required(),     // Distance between pickup and dropoff locations
//   estimated_fare: Joi.number().required(),// Estimated fare for the ride
//   passenger_name: Joi.string().required(),// Name of the passenger
//   passenger_rating: Joi.number()          // Rating of the passenger
//     .min(1)                              // Minimum rating value
//     .max(5)                              // Maximum rating value
//     .required(),
//   status: Joi.string()                    // Status of the ride request
//     .valid('Pending', 'Accepted', 'Rejected') // Valid status values
//     .required(),
//   timestamp: Joi.string()                 // Timestamp of the request
//     .isoDate()                          // Ensures ISO 8601 date format
//     .required()
// });

const rideRequestSchema = Joi.object({
  dropoff_latitude: Joi.number().required(),
  dropoff_longitude: Joi.number().required(),
  dropoff_address: Joi.number().required(),
  pickup_latitude: Joi.number().required(),
  pickup_longitude: Joi.number().required(),
  pickup_address: Joi.number().required(),
  vehiclePreferences: Joi.array().items(Joi.string().valid('sedan', 'suv', 'hatchback', 'luxury', 'minivan', 'van', 'coupe', 'convertible', 'pickupTruck', 'electric', 'hybrid')).required(),
  childSeatAvailable: Joi.boolean().optional(),
  expandRadius: Joi.boolean().optional(),
});


// To validate an array of ride requests
module.exports = {
  rideRequestSchema
}

// Example usage:
// const { error, value } = rideRequestsSchema.validate(rideRequestsData);
