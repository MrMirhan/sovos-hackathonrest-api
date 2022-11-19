var Boom = require('boom');
exports.wrapNano = function wrapNanoError(cb) {
    return function(err) {
        if (err) {
            console.log(err, err.statusCode || 500)
        }
        cb.apply(null, arguments);
    };
}