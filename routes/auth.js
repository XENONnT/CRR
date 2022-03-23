var express = require('express');
var router = express.Router();
var passport = require("passport");

router.get('/login', function(req, res) {
    res.render('login', {page: 'Login', menuId: 'home', user: req.user});
  });

// failed GitHub login 
router.get('/login-attempt-1cn9rbu94gi4n', function(req, res) {
  res.render('wrong_pass', 
    { page: 'Login',
      menuId: 'home',
      user: req.user,
      message: 'Error: You do not appear to be in our database. Please ' +
       'see Slack tech-support as it may be an issue with your information within XENON.',
      link: null
    }
  );
});

// failed LNGS login
router.get('/login-attempt-2poiux93jxm023', function(req, res) {
  res.render('wrong_pass', 
    { page: 'Login', 
      menuId: 'home', 
      user: req.user, 
      message: 'Error: Invalid username/password',
      link: null
    }
  );
});

// fail LNGS login -- suggest linking accounts
router.get('/login-attempt-3sowc37fbw0fjy3f', function (req, res) {
  var db = req.xenonnt_db;
  var collection = db.collection('users');
  var url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
  var lngs_id = url.searchParams.get('id');
  console.log(lngs_id);
  collection.find(
    { active: "true",
      pending: {$exists: false},
      lngs_ldap_uid: {$exists: false}
    }
  ).toArray(function(e, docs) {
    res.render('link_account',
      { page: 'Failed Login',
        menuId: 'home',
        user: req.user,
        data: docs,
        lngs: lngs_id
      }
    )
  });
});

// login using github
router.get('/github', 
  passport.authenticate('github', {scope: ['read:user', 'read:org']}), 
  function(req, res) {
    // The request gets redirected to github for authentication
    // so this function is not called
  }
);

// LNGS login
router.post('/ldap', function(req, res, next) {
  passport.authenticate('ldapauth', function(err, user, info) {
    console.log(err);
    console.log(user);
    if (user) { // success
      req.logIn(user, function(e) {
        res.redirect(req.session.returnTo || '/profile');
      });
    } else {
      console.log(`Info arg is ${info}`)
      if (!info) { // failure
        res.redirect('/auth/login-attempt-2poiux93jxm023');
      } else { 
        console.log(info.message);
        if (info.message === 'Invalid username/password') {
          res.redirect('/auth/login-attempt-2poiux93jxm023');
        } else { // successful login but not in db
          var u = new URL('https://xenonnt.lngs.infn.it/auth/login-attempt-3sowc37fbw0fjy3f');
          u.search = `id=${info.message}`;
          console.log(u);
          res.redirect(u);
        }
      }
    }
  })(req, res, next);
});

// callback link
router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/auth/login-attempt-1cn9rbu94gi4n'
  }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/profile');
});

// auth logout page
router.get('/logout', function(req, res) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;