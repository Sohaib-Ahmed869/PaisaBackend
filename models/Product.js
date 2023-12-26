const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  images: [String],       
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  size: [String],
  prod_code: { type: String, required: true, unique: true },
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  qty: { type: Number, default: 0 },
  approval: { type: Boolean, default: false }, 
  discount: { type: Number, default: 0 },
  active : { type: Boolean, default: true },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

