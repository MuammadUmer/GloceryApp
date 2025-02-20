
const responseMessage = async (response, responsestatus, message, data) => {
    response.status(responsestatus).send(data === null ? { status: responsestatus, message: message } : { status: responsestatus, message: message, data: data })
}

const responseError = async (response, message, error) => {
    const errorMessage = error.message || 'An error occurred';
    const errorStack = error.stack || '';
    response.status(500).send({
        message, error: {
            message: errorMessage,
            stack: errorStack
        }
    })
}

module.exports = {
    responseError,
    responseMessage
}
