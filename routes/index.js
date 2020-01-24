var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var Cart = require('../models/cart')
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;


var Product = require('../models/product')
var Order = require('../models/order')

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find((err, docs) => {
    if(err) {
      throw err
    }
    var productChunks = []
    var chunkSize = 3
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize))
    }
    res.render('shop/index', { title: 'JimRid', products: productChunks });
  })
  
});

router.get('/add-to-cart/:id', (req, res, next) => {
  var productId = req.params.id
  var cart = new Cart(req.session.cart ? req.session.cart : {})

  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect('/')
    }
    cart.add(product, product.id)
    req.session.cart = cart
    console.log(req.session.cart)
    res.redirect('/')
  })
})

router.get("/reduce/:id", (req, res, next) => {
  var productId = req.params.id
  var cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.reduceByOne(productId)
  req.session.cart = cart
  res.redirect('/shopping-cart')
});

router.get("/remove/:id", (req, res, next) => {
  var productId = req.params.id
  var cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.removeAll(productId)
  req.session.cart = cart
  res.redirect('/shopping-cart')
});

router.get("/increase/:id", (req, res, next) => {
  var productId = req.params.id
  var cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.increaseByOne(productId)
  req.session.cart = cart
  res.redirect('/shopping-cart')
});




router.get("/shopping-cart", (req, res, next) => {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null})
  }
  var cart = new Cart(req.session.cart)
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
});


router.get("/charge", isLoggedIn, (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('shop/shopping-cart')
  }
  var cart = new Cart(req.session.cart)
  res.render('shop/checkout-success', {total: cart.totalPrice})
});

router.post("/charge", isLoggedIn, (req, res) => {
  if (!req.session.cart) {
    return res.redirect('shop/shopping-cart')
  }
  var cart = new Cart(req.session.cart)

  const stripe = require('stripe')('sk_test_llXZoncEkSPKR5IliWzEdco600rwPF93QQ')
  let amount = cart.totalPrice * 100

  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => 
    stripe.charges.create({
      amount,
      description: 'sample',
      currency: 'usd',
      customer: customer.id
  }))
  .then(charge => {
    var order = new Order({
      user: req.user,
      cart: cart,
      email: req.body.stripeEmail,
      paymentId: charge.id
    })
    order.save()
    .then( result => {
      res.render('shop/checkout-success', {total: cart.totalPrice})
      req.session.cart = null
    })
  })
  .catch(err => {
    res.redirect('/')
  })
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.session.oldUrl = req.url
  res.redirect('/user/signin')
}

// router.post('/checkout', (req, res, next) => {

// stripe.charges.create({
//   amount: 999,
//   currency: 'usd',
//   description: 'Example charge',
//   source: token,
//   }, (err, charge) => {
//     if (err) {
//       return res.redirect('/checkout')
//     }
//     console.log(charge)
//     req.session.cart = null
//     res.redirect('/')
//   });
  
// })

// router.post("/checkout", (req, res, next) => {

//   stripe.charges.create({
//     amount: cart.totalPrice * 100,
//     currency: 'usd',
//     source: req.body.stripeToken,   
//     // from stripe.js from hidden field with the nameattribute stripeToken
//     description: "Charge for test@gmail.com"
//   }, (err, charge) => {
//       if (err) {
//         // using flash and try displaying the error inthe page like the way in sign up page
//         req.flash('error', err.message)
//         return res.redirect('/checkout')
//       }
      
//       req.flash('success', 'Successfully bought product')
//       req.session.cart = null
//       res.redirect('/')
//   })
// });



module.exports = router;
