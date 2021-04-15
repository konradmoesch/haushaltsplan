const express = require('express');
const router = express.Router();

function ajaxOnly(req, res, next) { // x - unused
  if (req.xhr) {
    return next();
  }
  res.sendStatus(403);
}

function adminOnly(req, res, next) { // x - unused
  if (req.user.admin === 1) {
    return next();
  }
  if (req.xhr) {
    return res.render('errors/http403_modal'); // x - does not exist
  }
  res.render('errors/http403', {title: 'HTTP 403: Forbidden'});  // x - does not exist
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
