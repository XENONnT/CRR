var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

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
    res.render('view', {page: 'View Requests', menuId: 'home', user: req.user, url: process.env.ENVS_URL});
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

router.post('/get-env', ensureAuthenticated, function(req, res) {
    var db = req.xenon_db;
    var collection = db.collection('contexts');

    collection.distinct('tag', function(e, doc) {
        res.send(JSON.stringify(doc));
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
    var db = req.xenon_db;
    var collection = db.collection('processing_requests');
    var contexts = db.collection('contexts');
    var runs = JSON.parse(req.body.runNumbers);
    
    var type = req.body.type
    var env = req.body.environment
    var context = req.body.context
    var hash_names = `hashes.${type}`

    query = '{ "name": "' + context + '", "tag": "' + env + '", "' + hash_names + '": {"$exists": true}}';

    query_str = String(query)
    
    console.log(query)
    console.log(query_str)
    query_json = JSON.parse(query_str);

    contexts.findOne(query_json).then(function(doc) {
        console.log(`NEW DOC IS: ${JSON.stringify(doc)}`);
        hash = doc['hashes'][type]

        var run_requests = []

        for (i in runs) {
            console.log(runs[i])
            var request_doc = {
                data_type: type,
                lineage_hash: hash,
                run_id: String(runs[i]),
                destination: req.body.destination,
                user: req.user.lngs_ldap_uid,
                request_date: new Date(),
        
                priority: parseInt(req.body.priority),
                comments: (req.body.comments || ''),
            };
            run_requests.push(request_doc)
        }
        console.log(run_requests);
        
        collection.insertMany(run_requests);

        return(res.redirect('/'))
    });
        
});

router.post('/get-requests', ensureAuthenticated, function(req,res) {
    var db = req.xenon_db;
    var collection = db.collection('processing_jobs');

    collection.find({}).toArray(function(e, doc) {
        res.send(JSON.stringify({'data': doc}));
    });
});

module.exports = router;