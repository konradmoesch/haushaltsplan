const express = require('express');
const router = express.Router();

function adminOnly(req, res, next) { // to be used later
  if (req.user.admin === 1) {
    return next();
  }
  if (req.xhr) {
    return res.render('errors/http403_modal');
  }
  res.render('errors/http403', {title: 'HTTP 403: Forbidden'});
}

router.get('/', function(req, res, next) {
  res.render('index', {title: 'Haushaltsplan'});
});
router.get('/profile', function(req, res, next) {
  res.render('profile', {title: 'Profilseite'});
});
router.get('/expenses', function(req, res, next) {
  res.render('expenses', {title: 'Ausgaben'});
});
router.get('/earnings', function(req, res, next) {
  res.render('earnings', {title: 'Einnahmen'});
});
router.get('/balance', function(req, res, next) {
  res.render('balance', {title: 'Bilanz'});
});

module.exports = router;
