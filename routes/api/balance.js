const express = require('express');
const router = express.Router();
const sql = require('../helpers/sql');
const api = require('../helpers/api');

router.route('/:id')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            let sqlStmt = 'SELECT(SELECT SUM(value) FROM earnings WHERE userid=? AND date<=? AND date>=?)-(SELECT SUM(value) FROM expenses WHERE userid=? AND date<=? AND date>=?) AS sum;';
            let queryData = [request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate];
            sql.querySQL(response, sqlStmt, queryData);
        }
    });

module.exports = router;
