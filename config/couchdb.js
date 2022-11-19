var nano = require('nano');

let couchDb;

try {
    couchDb = nano(process.env.COUCHDB_URL || `http://${process.env.DB_AUTH_USER}:${process.env.DB_AUTH_PASS}@127.0.0.1:5984`);
    console.log(`CouchDB Connected: ${couchDb.config.url}`);
} catch (err) {
    console.error(err);
    process.exit(1);
}

module.exports = couchDb