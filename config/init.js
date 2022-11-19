var async = require('async');
var couch = require('./couchdb');
var databases = ['users', 'invoices', 'config', 'roles', 'logs'];
module.exports = initCouch;

function initCouch(cb) {
    createDatabases(cb);
}

function createDatabases(cb) {
    async.each(databases, createDatabase, cb);
}

function createDatabase(db, cb) {
    couch.db.create(db, function(err) {
        if (err && err.statusCode == 412) {
            err = null;
        }
        cb(err);
    });
}