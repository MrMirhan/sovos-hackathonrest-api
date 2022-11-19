const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    phone: {
        type: Number,
        default: 905423219876
    },
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    billingAddress: {
        type: Object,
        default: {
            country: '',
            state: '',
            postCode: '',
            address: '',
            addressContinue: ''
        }
    },
    apiKeys: {
        type: Array,
        default: []
    },
    userPlan: {
        type: Object,
        default: {
            plan: 0,
            expiresIn: Date.now() + 100000
        }
    },
    regIp: {
        type: String,
        default: "127.0.0.1"
    },
    lastIp: {
        type: String,
        default: "127.0.0.1"
    },
    otp: String,
    otpExpirationTime: Date
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema);