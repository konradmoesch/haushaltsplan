const express = require('express');
const router = express.Router();
const sql = require('../helpers/sql');
const api = require('../helpers/api');

router.route('/:id')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Abrufen dieser Einnahmenliste ist ein Fehler aufgetreten')
        } else {
            let sqlStmt = 'SELECT id,date,name,value FROM earnings WHERE userid=? AND category=? AND date<=? AND date>=?;';
            let queryData = [request.params.id, request.query.category, request.query.lastdate, request.query.firstdate];
            sql.querySQL(response, sqlStmt, queryData);
        }
    })
    .post(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Ausführen dieser Abfrage ist ein Fehler aufgetreten')
        } else {
            let sqlStmt = 'INSERT INTO earnings (userid, category, date, name, value) VALUES (?, ?, ?, ?, ?);';
            let queryData = [request.params.id, request.body.category, request.body.date, request.body.name, request.body.value];
            sql.querySQL(response, sqlStmt, queryData);
        }
    });
router.route('/:id/sum')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            let sqlStmt = 'SELECT(SELECT SUM(value) FROM earnings WHERE userid=? AND category=0 AND date<=? AND date>=?) AS sumRecurring, (SELECT SUM(value) FROM earnings WHERE userid=? AND category=1 AND date<=? AND date>=?) AS sumOther;';
            let queryData = [request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate];
            sql.querySQL(response, sqlStmt, queryData);
        }
    });
router.route('/:id/sumall')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            let sqlStmt = 'SELECT SUM(value) AS sum FROM earnings WHERE userid=? AND date<=? AND date>=?;';
            let queryData = [request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate];
            sql.querySQL(response, sqlStmt, queryData);
        }
    });
router.route('/:id/days')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            let sqlStmt = 'SELECT DAY(date) AS day, SUM(value) AS sum FROM earnings WHERE userid=? AND date<=? AND date>=? GROUP BY date;';
            let queryData = [request.params.id, request.query.lastdate, request.query.firstdate];
            sql.querySQL(response, sqlStmt, queryData);
        }
    });

module.exports = router;
