let express = require('express');
let router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const con = require('../helpers/db');

function sendRes(res, status, response = null, error = null) {
    res.status(status).send(JSON.stringify({status, error, response}));
}

function ajaxOnly(req, res, next) {
    if (req.xhr) {
        return next();
    }
    res.sendStatus(403);
}

function adminOnlyApi(req, res, next) {
    if (req.user.admin === 1) {
        return next();
    }
    sendRes(res, 403, null, null);
}

router.route('/:id')
    .get(ajaxOnly, function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            sendRes(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            con.query('SELECT(SELECT SUM(value) FROM earnings WHERE userid=? AND date<=? AND date>=?)-(SELECT SUM(value) FROM expenses WHERE userid=? AND date<=? AND date>=?) AS sum;', [request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate], function (queryErr, queryRes) {
                if (queryErr) {
                    sendRes(response, 500, null, queryErr);
                } else {
                    sendRes(response, 200, queryRes);
                }
            });
        }
    });

module.exports = router;
