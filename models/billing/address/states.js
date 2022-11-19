const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const stateSchema = new Schema({
    name: {
        type: String,
        default: ""
    },
    continentName: {
        type: String,
        default: ""
    },
    shortName: {
        type: String,
        default: ""
    },
    postCode: {
        type: String,
        default: ""
    },
}, { timestamps: true })

module.exports = mongoose.model('State', stateSchema);