const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = wrapAsync(async (req, res, next) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to CampSight!');
            res.redirect('/campgrounds');
        })
    }
    catch(err){
        req.flash('error', err.message);
        res.redirect('/register');
    }
})

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
    delete req.session.returnTo;
}

module.exports.logoutUser = (req, res) => {
    req.logout(()=>{});
    req.flash('success', 'Good Bye!');
    res.redirect('/campgrounds');
}