const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    categories: { type: Array },

    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

ProductSchema.index({ title: 'text' });

const Products = mongoose.model('Products', ProductSchema);

Products.createIndexes({ ttitleitle: 'text' });

module.exports = mongoose.model('Products', ProductSchema);
