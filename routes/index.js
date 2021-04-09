var express = require('express');
var router = express.Router();

function ajaxOnly(req, res, next) {
  if (req.xhr) {
    return next();
  }
  res.sendStatus(403);
}

function adminOnly(req, res, next) {
  if (req.user.admin === 1) {
    return next();
  }
  if (req.xhr) {
    return res.render('errors/http403_modal');
  }
  res.render('errors/http403', {title: 'HTTP 403: Forbidden'});
}

router.get('/', function(req, res, next) {
  /*req.runMiddleware('/api/users/' + req.user.id, {method: 'get'}, function (responseCode, body) {
    res.render('index', {title: 'Haushaltsplan', userdata: JSON.parse(body)});
  });*/
  res.render('index', {title: 'Haushaltsplan'});
});
router.get('/profile', function(req, res, next) {
  res.render('profile', {title: 'Profilseite'});
});

module.exports = router;
