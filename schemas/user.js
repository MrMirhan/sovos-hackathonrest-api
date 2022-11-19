var extend = require('util')._extend;
var Joi = require('joi');
var updateAttributes = {
    _id: Joi.string(),
    _rev: Joi.string(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    hash: Joi.string(),
    salt: Joi.string(),
    access_token: [Joi.string(), Joi.number()],
    birthyear: Joi.number().integer().min(1900).max((new Date()).getFullYear())
};
exports.update = Joi.object(updateAttributes);
var createAttributes = extend({
    email: Joi.string().email()
}, updateAttributes);
exports.create = Joi.object(createAttributes);