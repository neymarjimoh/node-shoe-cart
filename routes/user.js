var express = require('express');
var router = express.Router();
var passport = require('passport')

var User = require('../models/user')

var Order = require('../models/order')
var Cart = require('../models/cart')


// Get user profile here
router.get("/profile", isLoggedIn, (req, res, next) => {
  // if (!req.session.cart) {
  //   return res.render('user/profile', {orders: null})
  // }
  Order.find({user: req.user}, (err, orders) => {
    if (err) {
      return res.write('Error page')
    }
    var cart
    orders.forEach( order => {
      cart = new Cart(order.cart)
      order.items = cart.generateArray()
    })
    res.render('user/profile', {orders: orders})
  })
});

  router.get("/logout", isLoggedIn, (req, res, next) => {
    req.logOut()
    res.redirect('/')
  });

router.use('/', notLoggedIn, (req, res, next) => {
    next()
})

// Get sign up page here
router.get("/signup", (req, res, next) => {
    res.render('user/signup')
  })
  
  // Get login page here
  router.get('/signin', (req, res, next) => {
    res.render('user/signin')
  })
  
  router.post('/signup', passport.authenticate('local.signup', {
    // successRedirect: '/user/signin',
    failureRedirect: '/user/signup',
    failureFlash: true
  }), (req, res, next) => {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl
      req.session.oldUrl = null
      res.redirect(oldUrl)
    } else {
      res.redirect('/user/signin')
    }
  })
  
  // create user login her
  router.post('/signin', passport.authenticate('local.signin', {
    // successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
  }), (req, res, next) => {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl
      req.session.oldUrl = null
      res.redirect(oldUrl)
    } else {
      res.redirect('/user/profile')
    }
  })

  module.exports = router;

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
  }

  function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
  }