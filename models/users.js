var schemas = require('../schemas');
var errors = require('../config/errors');
var users = require('../config/couchdb').use('users');
var diff = require('object-versions').diff;

users.update = function(obj, key, callback) {
    var db = this;
    db.get(key, function(error, existing) {
        if (!error) obj._rev = existing._rev;
        db.insert(obj, key, callback);
    });
}

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

    return true
}

exports.get = getUser;

async function getUser(user, ei, cb) {
    if (ei == 1) {
        const q = {
            selector: {
                email: { "$eq": user.email }
            },
        };
        return await users.find(q)
    } else if (ei == 0) {
        const q = {
            selector: {
                _id: { "$eq": user._id }
            },
        };
        return await users.find(q)
    }
}

exports.update = updateUser;

function updateUser(user, cb) {
    users.get(user._id, errors.wrapNano(async function(err, currentUser) {
        if (err) {
            cb(err);
        } else {
            var userDiff = diff(currentUser, user);
            let val = schemas.validate(userDiff, 'user', 'update', async function(err) {
                if (err) {
                    console.log(err)
                    cb(err);
                } else {}
            });
            if (val) {
                await users.update(user, 'user', function(err) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, user);
                    }
                });
            }
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