var express = require('express');
var router = express.Router();

// Home page: Page where people make requests
router.get('/', function(req, res) {
    res.render('request', {page: 'Make Requests', menuId: 'home', user: req.user});
});

router.get('/view-requests', function(req, res) {
    res.send('Table of requests')
});

module.exports = router;