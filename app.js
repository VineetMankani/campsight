if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const MongoDBStore = require('connect-mongo');

const User = require('./models/user');
const ExpressError = require('./utils/ExpressError');

const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());

const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/campsight';
// const dbURL = process.env.DB_URL;                       // ! Production
// const dbURL = 'mongodb://localhost:27017/campsight';    // ! Development

const secret = process.env.SECRET || 'secretcode';

const sessionConfig = {
    store: MongoDBStore.create({
        mongoUrl: dbURL,
        touchAfter: 24 * 3600
    }),
    name: 'sess',
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true,         // ! Use in Production
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// ! To store and unstore a user in a session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Connection Error:'));
db.once("open", function(){
    console.log('Databse Connected!')
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.all('*', (req, res, next) => {                      // ! Handling Error Middleware
    err = new ExpressError('Page Not Found!', 404);
    next(err)
})

app.use((err, req, res, next) => {
    const {status = 500} = err;
    if(!err.message) err.message = 'Something Went Wrong!'
    res.status(status).render('error', {err});
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on Port ${port}..`);
})