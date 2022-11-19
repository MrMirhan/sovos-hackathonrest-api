var extend = require('util')._extend;
var Joi = require('joi');
var updateAttributes = {
    _id: Joi.string(),
    _rev: Joi.string()
};
exports.update = Joi.object(updateAttributes);
var createAttributes = extend({
    invoice_no: Joi.string().required(),
    date: Joi.string(),
    amount: Joi.string(),
    currency: Joi.string(),
    supplier_taxpayer: Joi.string(),
    customer_taxpayer: Joi.string(),
}, updateAttributes);
exports.create = Joi.object(createAttributes);