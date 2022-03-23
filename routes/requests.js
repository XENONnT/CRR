var express = require('express');
var router = express.Router();

// Home page: Page where people make requests
router.get('/', function(req, res) {
    res.render('request', {page: 'Make Requests', menuId: 'home', user: req.user, url: process.env.ENVS_URL});
});

router.get('/view-requests', function(req, res) {
    res.send('Table of requests')
});

router.post('/run-list-preview/:query', function(req, res) {
    var query = JSON.parse(req.params.query);
    console.log(typeof(query))
    console.log(query)
    var db = req.xenon_db;
    var collection = db.collection('runs');

    collection.find(query).toArray(function(e, doc) {
        console.log(e);
        console.log(doc);
        res.send(JSON.stringify({"data": doc}));
    });
});

router.post('/get-context/:query', function(req, res) {
    var query = JSON.parse(req.params.query);
    console.log(typeof(query))
    console.log(query)
    var db = req.xenon_db;
    var collection = db.collection('contexts');

    collection.find(query).toArray(function(e, doc) {
        console.log(e);
        console.log(doc);
        res.send(JSON.stringify(doc));
    });
});

module.exports = router;