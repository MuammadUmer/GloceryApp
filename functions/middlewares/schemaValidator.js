const _ = require('lodash');
const Joi = require('joi');
const Schemas = require('../schema');

module.exports = (useJoiError = false) => {

    const _useJoiError = _.isBoolean(useJoiError) && useJoiError;
    const _supportedMethods = ['post', 'put'];
    const _validationOptions = {
        abortEarly: false,  // abort after the last validation error
        allowUnknown: true, // allow unknown keys that will be ignored
        stripUnknown: true  // remove unknown keys from the validated data
    };

    // return the validation middleware
    return (req, res, next) => {
        const method = req.method.toLowerCase();
        const baseRoute = req.baseUrl.replace(/^\/+/, '');
        const schemaPath = `${baseRoute}.${req.path}`;

        if (_.includes(_supportedMethods, method) && _.has(Schemas, schemaPath)) {
            const _schema = _.get(Schemas, schemaPath);
            if (_schema) {
                const { error, value } = _schema.validate(req.body, _validationOptions);
                if (error) {
                    const JoiError = {
                        status: 'failed',
                        errors: _.map(error.details, ({ message, type, context }) => {
                            // Custom handling for boolean fields
                            let customMessage = message.replace(/['"]/g, '');
                            if (type === 'any.required' && context?.label) {
                                customMessage = `${context.label} is required and should be a boolean value.`;
                            }

                            return {
                                field: context.label,  // Field name causing the error
                                message: customMessage, // Clean up the message and provide additional context
                                type  // Error type
                            };
                        })
                    };
                    return res.status(422).json(_useJoiError ? JoiError : {
                        status: 'failed',
                        error: 'Invalid request data. Please review the request and try again.'
                    });
                } else {
                    req.body = value
                    next();
                }
            }
        } else {
            next();
        }

    };
};