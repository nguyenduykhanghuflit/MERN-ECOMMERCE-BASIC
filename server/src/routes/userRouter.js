const router = require('express').Router();
const UserContronller = require('../controllers/userContronller');
const auth = require('../middleware/auth');
router.get('/', UserContronller.test);
router.post('/register', UserContronller.register);
router.post('/login', UserContronller.login);

router.get('/logout', UserContronller.logout);

router.get('/refresh_token', UserContronller.refreshToken);

router.get('/infor', auth, UserContronller.getUser);
router.post('/cart', auth, UserContronller.addCart);
router.post('/update-cart', auth, UserContronller.updateCart);
router.post('/order', auth, UserContronller.order);
module.exports = router;
