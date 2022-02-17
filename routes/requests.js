var express = require('express');
var router = express.Router();

// Home page: Page where people make requests
router.get('/', function(req, res) {
    res.send('Requests form')
});

router.get('/view-requests', function(req, res) {
    res.send('Table of requests')
});

module.exports = router;