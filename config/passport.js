var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')

function initialize(passport) {
    passport.use('local.signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        User.find({email: email}, (err, user) => {
            if (err) {
                return done(err)
            }
            if (user.length >= 1) {
                return done(null, false, {message: 'User with that email already exists'})
            } 
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return done(err)
                }
                var user = new User({
                    // name: name,
                    email: email,
                    password: hash
                })
                user.save((err, result) => {
                    if(err) {
                        return done(err)
                    }
                    return done(null, user)
                })
            })
        })
    }))

    passport.use('local.signin', new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done ) => {
        User.findOne({email: email}, (err, user) => {
            if (user == null) {
                return done(null, false, {message: 'No user with that email'})
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Password incorrect'})
                }
                
            } )
        })
    }))
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, function (err, user) {
            done(err, user);
          });
    })
}

module.exports = initialize

// passport.use('local.signup', new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback: true
// },  function(req, email, password, done) {
//     req.checkBody('email', 'Invalid email').notEmpty().isEmail()
//     req.checkBody('password', 'Invalid password').notEmpty().isLength({min: 4})
//     var errors = req.validationErrors()
//     if (errors) {
//         var messages = []
//         errors.forEach(function(error) {
//             messages.push(error.msg)
//         })
//         return done(null, false, req.flash('error', messages))
//     }
//         User.findOne({ 'email': email}, function(err, user) {
//             if (err) {
//                 return done(err)
//             }
//             if (user) {
//                 return done(null, false, {message: 'Email is already in use'})
//             }
//             var newUser = new User()
//             newUser.email = email,
//             newUser.password = newUser.encryptPassword(password)
//             newUser.save(function(err, result) {
//                 if (err) {
//                     return done(err)
//                 }
//                 return done(null, newUser)
//             })
//         })
//     }
// ))