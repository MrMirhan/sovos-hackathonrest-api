var Joi = require('joi');
var Boom = require('boom');
var schemaNames = ['user'];
var schemas = {};
schemaNames.forEach(function(schemaName) {
    schemas[schemaName] = require('./' + schemaName);
});

exports.validate = validate;

function validate(doc, schema, op, cb) {
    if (typeof schema == 'string') {
        schema = schemas[schema];
    }
    if (!schema) {
        cb(new Error('Unknown schema'));
    } else {
        schema = schema[op];
        if (!schema) {
            throw new Error('Undefined op ' + op);
        } else {
            return schema.validate(doc);
        }
    }
};
exports.validating = function validating(schemaName, op, fn) {
    var schema = schemas[schemaName];
    if (!schema) {
        throw new Error('Unknown schema: ' + schemaName);
    }
    return function(doc, cb) {
        validate(doc);
    };
};