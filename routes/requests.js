var express = require('express');
var router = express.Router();

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth/login');
}

// Home page: Page where people make requests
router.get('/', ensureAuthenticated, function(req, res) {
    res.render('request', {page: 'Make Requests', menuId: 'home', user: req.user, url: process.env.ENVS_URL});
});

router.get('/view-requests', ensureAuthenticated, function(req, res) {
    res.send('Table of requests')
});

router.post('/run-list-preview/:query', ensureAuthenticated, function(req, res) {
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

router.post('/get-context/:query', ensureAuthenticated, function(req, res) {
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

router.post('/submit-request', ensureAuthenticated, function(req, res) {
    console.log(req.body)
    var db = req.xenon_db;
    var collection = db.collection('requests');
    console.log(req.body)
    var request_doc = {
        run_numbers: req.body.runNumbers,
        user: req.user.lngs_ldap_uid,
        request_date: new Date(),
        env: req.body.environment,
        context: req.body.context,
        type: req.body.type,
        priority: req.body.priority,
        comments: req.body.comments,
        progress: 0,
        completed: false
    };
    console.log(request_doc);
    

});

module.exports = router;