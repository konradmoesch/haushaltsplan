const express = require('express');
const router = express.Router();
const con = require('../helpers/db');
const api = require('../helpers/api');

router.route('/:id')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            con.query('SELECT(SELECT SUM(value) FROM earnings WHERE userid=? AND date<=? AND date>=?)-(SELECT SUM(value) FROM expenses WHERE userid=? AND date<=? AND date>=?) AS sum;', [request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate], function (queryErr, queryRes) {
                if (queryErr) {
                    api.sendJSONResponse(response, 500, null, queryErr);
                } else {
                    api.sendJSONResponse(response, 200, queryRes);
                }
            });
        }
    });

module.exports = router;
