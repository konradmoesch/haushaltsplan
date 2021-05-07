const express = require('express');
const router = express.Router();
const sql = require('../helpers/sql');
const api = require('../helpers/api');

router.route('/:id')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Abrufen dieser Ausgabenliste ist ein Fehler aufgetreten')
        } else {
            let sqlStmt = 'SELECT id,date,name,place,value FROM expenses WHERE userid=? AND category=? AND date<=? AND date>=?;';
            let queryData = [request.params.id, request.query.category, request.query.lastdate, request.query.firstdate];
            sql.querySQL(response, sqlStmt, queryData);
        }
    })
    .post(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Ausführen dieser Abfrage ist ein Fehler aufgetreten')
        } else {
            let sqlStmt = 'INSERT INTO expenses (userid, category, date, name, place, value) VALUES (?, ?, ?, ?, ?, ?);';
            let queryData = [request.params.id, request.body.category, request.body.date, request.body.product, request.body.place, request.body.value];
            sql.querySQL(response, sqlStmt, queryData);
        }
    });
router.route('/:id/sum')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            let sqlStmt = 'SELECT(SELECT SUM(value) FROM expenses WHERE userid=? AND category=0 AND date<=? AND date>=?) AS sumLocal, (SELECT SUM(value) FROM expenses WHERE userid=? AND category=1 AND date<=? AND date>=?) AS sumRecurring, (SELECT SUM(value) FROM expenses WHERE userid=? AND category=2 AND date<=? AND date>=?) AS sumOnline;';
            let queryData = [request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate];
            sql.querySQL(response, sqlStmt, queryData);
        }
    });
router.route('/:id/sumall')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            let sqlStmt = 'SELECT SUM(value) AS sum FROM expenses WHERE userid=? AND date<=? AND date>=?;';
            let queryData = [request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate];
            sql.querySQL(response, sqlStmt, queryData);
        }
    });
router.route('/:id/days')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            let sqlStmt = 'SELECT DAY(date) AS day, SUM(value) AS sum FROM expenses WHERE userid=? AND date<=? AND date>=? GROUP BY date;';
            let queryData = [request.params.id, request.query.lastdate, request.query.firstdate];
            sql.querySQL(response, sqlStmt, queryData);
        }
    });
router.route('/:id/groupname')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            let sqlStmt = 'SELECT name, SUM(value) AS value FROM expenses WHERE userid=? AND date<=? AND date>=? GROUP BY name;';
            let queryData = [request.params.id, request.query.lastdate, request.query.firstdate];
            sql.querySQL(response, sqlStmt, queryData);
        }
    });
router.route('/:id/stats')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            let sqlStmt = 'DROP TABLE IF EXISTS Monate;\n' +
                '#Temporäre Tabelle\n' +
                'CREATE TEMPORARY TABLE IF NOT EXISTS Monate (\n' +
                '    `month`  DATE,\n' +
                '    `expenses` FLOAT,\n' +
                '    `earnings` FLOAT,\n' +
                '    `balance` FLOAT);\n' +
                '\n' +
                'DELIMITER //\n' +
                'DROP PROCEDURE IF EXISTS create_months;\n' +
                'CREATE PROCEDURE create_months()\n' +
                '    BEGIN\n' +
                '        DECLARE i INT;\n' +
                '        SET i = 1;\n' +
                '        while i <= 13 do\n' +
                '                INSERT INTO Monate (`month`) VALUES (LAST_DAY(? - INTERVAL i MONTH) + INTERVAL 1 DAY );\n' +
                '                UPDATE Monate SET expenses = (SELECT SUM(value) from expenses WHERE DATE_FORMAT(`date` , \'%y-%m\') = DATE_FORMAT(LAST_DAY(? - INTERVAL i MONTH) + INTERVAL 1 DAY, \'%y-%m\') AND userid = ?) WHERE month = LAST_DAY(? - INTERVAL i MONTH) + INTERVAL 1 DAY;\n' +
                '                UPDATE Monate SET earnings = (SELECT SUM(value) from earnings WHERE DATE_FORMAT(`date` , \'%y-%m\') = DATE_FORMAT(LAST_DAY(? - INTERVAL i MONTH) + INTERVAL 1 DAY, \'%y-%m\') AND userid = ?) WHERE month = LAST_DAY(? - INTERVAL i MONTH) + INTERVAL 1 DAY;\n' +
                '                UPDATE Monate SET balance = (SELECT SUM(value) from earnings WHERE DATE_FORMAT(`date` , \'%y-%m\') = DATE_FORMAT(LAST_DAY(? - INTERVAL i MONTH) + INTERVAL 1 DAY, \'%y-%m\'))-(SELECT SUM(value) from expenses WHERE DATE_FORMAT(`date` , \'%y-%m\') = DATE_FORMAT(LAST_DAY(curdate() - INTERVAL i MONTH) + INTERVAL 1 DAY, \'%y-%m\')) WHERE month = LAST_DAY(curdate() - INTERVAL i MONTH) + INTERVAL 1 DAY;\n' +
                '        set i=i+1;\n' +
                '        end while;\n' +
                '    END\n' +
                '//\n' +
                'DELIMITER ;\n' +
                'CALL create_months();\n' +
                'SELECT * from Monate;\n' +
                'DROP TABLE Monate;';
            let queryData = [request.query.date, request.query.date, request.params.id, request.query.date, request.query.date, request.params.id, request.query.date, request.query.date];
            sql.querySQL(response, sqlStmt, queryData);
        }
    });

module.exports = router;
