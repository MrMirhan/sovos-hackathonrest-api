const mongoose = require(mongoose);
const Schema = mongoose.Schema;
const userSchema = new Schema({
    userId: { required: true, type: Number },
    apiId: { required: true, type: Number },
    strategyId: { required: true, type: Number },
    marketId: { required: true, type: Number },
    orderId: { required: true, type: Number },
    pair: { required: true, type: String },
    side: { required: true, type: String },
    entryPrice: { required: true, type: mongoose.Types.Decimal128 },
    closePrice: { required: true, type: mongoose.Types.Decimal128 },
    markPrice: { required: true, type: mongoose.Types.Decimal128 },
    stopLoss: { required: true, type: mongoose.Types.Decimal128 },
    takeProfit: { required: true, type: mongoose.Types.Decimal128 },
    pnl: { required: true, type: mongoose.Types.Decimal128 },
    roi: { required: true, type: mongoose.Types.Decimal128 },
    margin: { required: true, type: mongoose.Types.Decimal128 },
    quantity: { required: true, type: mongoose.Types.Decimal128 },
    leverage: { required: true, type: Number }
}, { timestamps: true })

module.exports = mongoose.model(User, userSchema);