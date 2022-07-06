const express = require('express');
const router = express.Router({ mergeParams: true });

const users = require('../controllers/users');
const passport = require('passport');

router.get('/', (req, res) => {
    res.render('home');
})

router.route('/register')
    .get(users.renderRegisterForm)
    .post(users.registerUser)

const auth = passport.authenticate('local', { failureMessage: false, failureRedirect: '/login' })

router.route('/login')
    .get(users.renderLoginForm)
    .post(auth, users.loginUser)

router.get('/logout', users.logoutUser)

module.exports = router;