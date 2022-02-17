const express = require('express')
var path = require('path');
const app = express();
const port = 3000;

// Routers for subsites
var requestsRouter = require('./routes/requests');
var authRouter = require('./routes/auth'); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', requestsRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

module.exports = app