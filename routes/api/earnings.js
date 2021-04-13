const express = require('express');
const router = express.Router();
const con = require('../helpers/db');
const api = require('../helpers/api');

router.route('/:id')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Abrufen dieser Einnahmenliste ist ein Fehler aufgetreten')
        } else {
            con.query('SELECT id,date,name,value FROM earnings WHERE userid=? AND category=? AND date<=? AND date>=?;', [request.params.id, request.query.category, request.query.lastdate, request.query.firstdate], function (queryErr, queryRes) {
                if (queryErr) {
                    api.sendJSONResponse(response, 500, null, queryErr);
                } else {
                    api.sendJSONResponse(response, 200, queryRes);
                }
            });
        }
    })
    .post(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Ausführen dieser Abfrage ist ein Fehler aufgetreten')
        } else {
            con.query('INSERT INTO earnings (userid, category, date, name, value) VALUES (?, ?, ?, ?, ?);', [request.params.id, request.body.category, request.body.date, request.body.name, request.body.value], function (queryErr, queryRes) {
                if (queryErr) {
                    api.sendJSONResponse(response, 500, null, queryErr);
                } else {
                    api.sendJSONResponse(response, 200, 'Diese Ausgabe ist erfolgreich hinzugefügt worden.');
                }
            });
        }
    });
router.route('/:id/sum')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            con.query('SELECT(SELECT SUM(value) FROM earnings WHERE userid=? AND category=0 AND date<=? AND date>=?) AS sumRecurring, (SELECT SUM(value) FROM earnings WHERE userid=? AND category=1 AND date<=? AND date>=?) AS sumOther;', [request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate], function (queryErr, queryRes) {
                if (queryErr) {
                    api.sendJSONResponse(response, 500, null, queryErr);
                } else {
                    api.sendJSONResponse(response, 200, queryRes);
                }
            });
        }
    });
router.route('/:id/sumall')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            con.query('SELECT SUM(value) AS sum FROM earnings WHERE userid=? AND date<=? AND date>=?;', [request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate], function (queryErr, queryRes) {
                if (queryErr) {
                    api.sendJSONResponse(response, 500, null, queryErr);
                } else {
                    api.sendJSONResponse(response, 200, queryRes);
                }
            });
        }
    });
router.route('/:id/days')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            con.query('SELECT DAY(date) AS day, SUM(value) AS sum FROM earnings WHERE userid=? AND date<=? AND date>=? GROUP BY date;', [request.params.id, request.query.lastdate, request.query.firstdate], function (queryErr, queryRes) {
                if (queryErr) {
                    api.sendJSONResponse(response, 500, null, queryErr);
                } else {
                    api.sendJSONResponse(response, 200, queryRes);
                }
            });
        }
    });

module.exports = router;
