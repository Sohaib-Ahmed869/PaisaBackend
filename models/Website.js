const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String, required: true }, 
    gst: { type: String, required: true } 
});

const Website = mongoose.model('Website', websiteSchema);
module.exports = Website;