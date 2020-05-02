const express = require('express');
const router = express.Router();
const passport = require('passport');

// Bring in Models & Helpers
const Order = require('../../models/order');
const Cart = require('../../models/cart');

router.post(
  '/add',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const cart = req.body.cartId;
    const user = req.body.userId;

    const order = new Order({
      cart,
      user
    });

    order.save((err, order) => {
      if (err) {
        return res.status(400).json({
          error: 'Your request could not be processed. Please try again.'
        });
      }

      res.status(200).json({
        success: true,
        message: `Your order has been placed successfully!`,
        order: order
      });
    });
  }
);

// fetch all orders api
router.get(
  '/list/:userId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user = req.params.userId;
    Order.find({ user })
      .populate({
        path: 'cart'
        // populate: {
        //   path: 'cart.products',
        //   populate: {
        //     path: 'products.product',
        //     populate: {
        //       path: 'product.brand'
        //     }
        //   }
        // }
      })
      .exec((err, docs) => {
        if (err) {
          return res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
          });
        }

        if (docs.length > 0) {
          const newDataSet = [];
          docs.forEach(doc => {
            Cart.findById(doc.cart._id)
              .populate({
                path: 'products.product',
                populate: {
                  path: 'brand'
                }
              })
              .exec((err, data) => {
                if (err) {
                  return res.status(400).json({
                    error:
                      'Your request could not be processed. Please try again.'
                  });
                }

                const order = {
                  _id: doc._id,
                  products: data.products
                };

                newDataSet.push(order);

                if (newDataSet.length === docs.length) {
                  res.status(200).json({
                    orders: newDataSet
                  });
                }
              });
          });
        } else {
          res.status(200).json({
            success: true,
            message: `You have no orders yet!`
          });
        }
      });
  }
);

// fetch order api
router.get('/:orderId', (req, res) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .populate({
      path: 'cart'
    })
    .exec((err, doc) => {
      if (err) {
        return res.status(400).json({
          error: 'Your request could not be processed. Please try again.'
        });
      }
      Cart.findById(doc.cart._id)
        .populate({
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        })
        .exec((err, data) => {
          if (err) {
            return res.status(400).json({
              error: 'Your request could not be processed. Please try again.'
            });
          }

          const order = {
            _id: doc._id,
            products: data.products
          };

          res.status(200).json({
            order
          });
        });
    });
});

module.exports = router;
