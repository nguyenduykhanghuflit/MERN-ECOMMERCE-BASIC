const Products = require('../models/productModel');
class ProductController {
  async createProduct(req, res) {
    const newProduct = new Products(req.body);
    try {
      const savedProduct = await newProduct.save();
      res.status(200).json(savedProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async getProducts(req, res) {
    try {
      const { sort, limit, search } = req.query;
      if (search) {
        const products = await Products.find()
          .sort(sort || '-createdAt')
          .limit(limit)
          .find({
            $text: { $search: search },
          });
        return res.status(200).json(products);
      }
      const products = await Products.find()
        .sort(sort || '-createdAt')
        .limit(limit);
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async getProduct(req, res) {
    const { id } = req.params;
    try {
      const product = await Products.findById(id);
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
module.exports = new ProductController();
