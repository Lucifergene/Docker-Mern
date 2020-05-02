const express = require('express');
const router = express.Router();
const passport = require('passport');

// Bring in Models & Helpers
const Cart = require('../../models/cart');

// fetch/create cart Id
router.get(
  '/create/:userId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user = req.params.userId;

    const cart = new Cart({
      user
    });

    cart.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Your request could not be processed. Please try again.'
        });
      }

      res.status(200).json({
        success: true,
        cartId: data.id
      });
    });
  }
);

router.post(
  '/push/:cartId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const products = req.body.products;
    const query = { _id: req.params.cartId };

    Cart.updateOne(query, { products }).exec(err => {
      if (err) {
        return res.status(400).json({
          error: 'Your request could not be processed. Please try again.'
        });
      }
      res.status(200).json({
        success: true
      });
    });
  }
);

router.post(
  '/add/:cartId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const product = req.body.product;
    const query = { _id: req.params.cartId };

    Cart.updateOne(query, { $push: { products: product } }).exec(err => {
      if (err) {
        return res.status(400).json({
          error: 'Your request could not be processed. Please try again.'
        });
      }
      res.status(200).json({
        success: true
      });
    });
  }
);

router.delete(
  '/delete/:cartId/:productId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const product = { product: req.params.productId };
    const query = { _id: req.params.cartId };

    Cart.updateOne(query, { $pull: { products: product } }).exec(err => {
      if (err) {
        return res.status(400).json({
          error: 'Your request could not be processed. Please try again.'
        });
      }
      res.status(200).json({
        success: true
      });
    });
  }
);

module.exports = router;
