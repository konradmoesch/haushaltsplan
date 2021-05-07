const express = require('express');
const router = express.Router();
const passport = require('passport');
require('./helpers/passport')(passport);
router.get('/', function (req, res) {
    res.render('login', {title: 'Login'});
});
router.get('/signup', function (req, res) {
    res.render('signup', {title: 'Nutzererstellung'});
});
router.post('/', function (req, res) {
    passport.authenticate('local-login', null ,function (err, user) {
        if (err) {
            console.error(err);
            res.status(500).send(JSON.stringify({'status': 200, 'error': 'Datenbankfehler. Bitte kontaktieren Sie einen Serveradministrator. ', 'response': false}));
        } else if (user) {
            req.logIn(user, function () {
                res.status(200).send(JSON.stringify({'status': 200, 'error': null, 'response': true}));
            });
        } else {
            res.status(401).send(JSON.stringify({'status': 401, 'error': 'Zugangsdaten unbekannt.', 'response': null}));
        }
    })(req, res);
});
router.get('/logout', function (req, res) {
    req.session.destroy(function(){
        res.redirect('/login');
    });
});

module.exports = router;
