var express = require('express');
var router = express.Router();

router.get('/login', function(req, res) {
    res.render('login', {page: 'Login', menuId: 'home', user: req.user});
  });

module.exports = router;