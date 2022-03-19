const express = require('express')
var path = require('path');
var dotenv = require('dotenv');
const MongoClient = require('mongodb').MongoClient;

dotenv.config();

const app = express();
const port = 3000;

// Connect mongo
const mongoURI = process.env.MONGO_URI;
var db;
MongoClient.connect(mongoURI, {useUnifiedTopology: true}, (err, db) => {
  db = db.db('xenon');
  console.log(`mongoDB is connected to remote mongo`),
  err => {console.log(err);}
});

// Make our db accessible to our router
app.use((req,res,next) => {
  req.db = db;
  next();
});

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