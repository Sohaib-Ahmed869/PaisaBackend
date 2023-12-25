const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }
});

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

module.exports = Advertisement;