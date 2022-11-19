const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const countrySchema = new Schema({
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
    phoneCode: {
        type: Number,
        default: ""
    },
}, { timestamps: true })

module.exports = mongoose.model('Country', countrySchema);