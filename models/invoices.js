var schemas = require('../schemas');
var errors = require('../config/errors');
var invoices = require('../config/couchdb').use('invoices');
var diff = require('object-versions').diff;

/// Create invoice
exports.create = createInvoice;

async function createInvoice(invoice, cb) {
    schemas.validate(invoice, 'invoice', 'create', function(err) {
        if (err) {
            cb(err);
        } else {
            merge();
        }
    });

    const insert = await invoices.insert(invoice, function(err) {
        if (err) {
            cb(err);
        } else {
            cb(null, invoice);
        }
    });

    return true
}

exports.get = getInvoice;

async function getInvoice(invoice, ei) {
    if (ei == 1) {
        const q = {
            selector: {
                invoice_no: { "$eq": invoice.invoice_no }
            },
        };
        return await invoices.find(q)
    } else if (ei == 0) {
        const q = {
            selector: {
                _id: { "$eq": invoice._id }
            },
        };
        return await invoices.find(q)
    }
}

exports.update = updateInvoice;

function updateInvoice(invoice, cb) {
    invoices.get(invoice._id, errors.wrapNano(function(err, currentInvoice) {
        if (err) {
            cb(err);
        } else {
            var invoiceDiff = diff(currentInvoice, invoice);
            schemas.validate(invoiceDiff, 'invoice', 'update', function(err) {
                if (err) {
                    cb(err);
                } else {
                    invoices.insert(invoice, errors.wrapNano(cb));
                }
            });
        }
    }));
}

exports.updateDiff = updateInvoiceDiff;

function updateInvoiceDiff(invoiceDiff, cb) {
    schemas.validate(invoiceDiff, 'invoice', 'update', function(err) {
        if (err) {
            cb(err);
        } else {
            merge();
        }
    });

    function merge() {
        invoices.get(invoiceDiff._id, errors.wrapNano(function(err, user) {
            if (err) {
                cb(err);
            } else {
                extend(invoice, invoiceDiff);
                invoices.insert(invoice, errors.wrapNano(done));
            }
        }));

        function done(err) {
            if (err && err.statusCode == 409 && !invoiceDiff._rev) {
                merge(); // try again
            } else {
                cb.apply(null, arguments);
            }
        }
    }
}