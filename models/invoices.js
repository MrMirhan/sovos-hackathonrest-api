var schemas = require('../schemas');
var errors = require('../config/errors');
var users = require('../config/couchdb').use('users');
var diff = require('object-versions').diff;

/// Create user
exports.create = createUser;

async function createUser(user, cb) {
    schemas.validate(user, 'user', 'create', function(err) {
        if (err) {
            cb(err);
        } else {
            merge();
        }
    });

    const insert = await users.insert(user, function(err) {
        if (err) {
            cb(err);
        } else {
            cb(null, user);
        }
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    let nuser = await getUser(user)

    return nuser
}

exports.get = getUser;

async function getUser(user, cb) {
    const q = {
        selector: {
            email: { "$eq": user.email }
        },
    };
    const response = await users.find(q)
    return response
}

exports.update = updateUser;

function updateUser(user, cb) {
    users.get(user._id, errors.wrapNano(function(err, currentUser) {
        if (err) {
            cb(err);
        } else {
            var userDiff = diff(currentUser, user);
            schemas.validate(userDiff, 'user', 'update', function(err) {
                if (err) {
                    cb(err);
                } else {
                    users.insert(user, errors.wrapNano(cb));
                }
            });
        }
    }));
}

exports.updateDiff = updateUserDiff;

function updateUserDiff(userDiff, cb) {
    schemas.validate(userDiff, 'user', 'update', function(err) {
        if (err) {
            cb(err);
        } else {
            merge();
        }
    });

    function merge() {
        users.get(userDiff._id, errors.wrapNano(function(err, user) {
            if (err) {
                cb(err);
            } else {
                extend(user, userDiff);
                users.insert(user, errors.wrapNano(done));
            }
        }));

        function done(err) {
            if (err && err.statusCode == 409 && !userDiff._rev) {
                merge(); // try again
            } else {
                cb.apply(null, arguments);
            }
        }
    }
}