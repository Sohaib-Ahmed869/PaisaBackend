const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
    voucher_code: { type: String, required: true, unique: true },
    is_used: { type: Boolean, default: false },

});

const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;