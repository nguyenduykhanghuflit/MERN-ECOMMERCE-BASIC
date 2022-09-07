const Users = require('../models/userModel');
const Orders = require('../models/orderModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class UserContronller {
  test(req, res) {
    res.send('test');
  }
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: 'The email already exists.' });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: 'Password is at least 6 characters long.' });

      // Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });

      // Save mongodb
      await newUser.save();

      // Then create jsonwebtoken to authentication
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      //lưu refreshtoken vào cookie
      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      //trả về accesstoken
      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
  async login(req, res) {
    try {
      const { email } = req.body;

      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'User does not exist.' });

      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Incorrect password.' });

      // If login success , create access token and refresh token
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      const { password, ...others } = user._doc;
      res.json({ accesstoken, ...others });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
  async logout(req, res) {
    try {
      res.clearCookie('refreshtoken', { path: '/' });
      return res.json({ msg: 'Logged out' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
  refreshToken(req, res) {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: 'Please Login or Register' });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: 'Please Login or Register' });

        const accesstoken = createAccessToken({ id: user.id });

        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  async getUser(req, res) {
    try {
      const user = await Users.findById(req.user.id).select('-password');
      if (!user) return res.status(400).json({ msg: 'User does not exist.' });

      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  async addCart(req, res) {
    const cart = req.body;
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: 'User does not exist.' });
      let currentCart = user.cart;
      let updated = false;

      const list = currentCart.products;

      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          if (list[i]._id === cart._id && list[i].size === cart.size) {
            list[i].quantity += cart.quantity;

            currentCart.total += cart.price * cart.quantity;
            updated = true;
            break;
          }
        }
      }

      if (!updated) {
        currentCart.products.push(cart);
        currentCart.quantity += 1;
        currentCart.total += cart.price * cart.quantity;
      }

      user.cart = { ...currentCart };
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: currentCart,
        }
      );

      return res.send(user.cart);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
  async updateCart(req, res) {
    const { _id, type, size } = req.body;

    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: 'User does not exist.' });
      let listProduct = user.cart.products;
      let currentCart = user.cart;
      if (type == 'dec') {
        listProduct.forEach((item) => {
          if (item._id == _id && item.size == size) {
            if (item.quantity > 1) {
              item.quantity--;
              currentCart.total -= item.price;
            }
          }
        });
      } else if (type == 'delete') {
        listProduct.forEach((item) => {
          if (item._id == _id && item.size == size) {
            currentCart.total -= item.price * item.quantity;
            currentCart.quantity--;
          }
        });
        listProduct = listProduct.filter(
          (item) => item._id !== _id && item.size !== size
        );
      } else {
        listProduct.forEach((item) => {
          if (item._id == _id && item.size == size) {
            item.quantity++;

            currentCart.total += item.price;
          }
        });
      }

      currentCart.products = listProduct;
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: currentCart,
        }
      );

      return res.send(currentCart);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  async order(req, res) {
    let data = req.body;
    data.userId = req.user.id;
    const newOrder = new Orders(data);
    try {
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = new UserContronller();
