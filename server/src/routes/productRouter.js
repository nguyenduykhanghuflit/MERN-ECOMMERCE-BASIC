const router = require('express').Router();
const ProductController = require('../controllers/productController');

router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProduct);
router.post('/', ProductController.createProduct);
module.exports = router;
