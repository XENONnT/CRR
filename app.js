const express = require('express')
var path = require('path');
var dotenv = require('dotenv');
const MongoClient = require('mongodb').MongoClient;
var session = require('express-session');

dotenv.config();

const app = express();
const port = 3000;

// Connect mongo
const mongoURI = process.env.MONGO_URI;
var xenon_db;
MongoClient.connect(mongoURI, {useUnifiedTopology: true}, (err, db) => {
  xenon_db = db.db('xenon');
  console.log(`mongoDB is connected to remote mongo`),
  err => {console.log(err);}
});

// Make our db accessible to our router
app.use((req,res,next) => {
  req.xenon_db = xenon_db;
  next();
});

// Set up express session for passport.js sessions
app.use(session({
  secret: process.env.EXPRESS_SESSION,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  resave: false,
  saveUninitialized: false
}));

// Passport Auth
var passport = require("passport");
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());


// Routers for subsites
var requestsRouter = require('./routes/requests');
var authRouter = require('./routes/auth'); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', requestsRouter);
app.use('/auth', authRouter);

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

module.exports = app