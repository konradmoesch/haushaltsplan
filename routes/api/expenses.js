let express = require('express');
let router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const con = require('../helpers/db');

function sendRes(res, status, response = null, error = null) {
    res.status(status).send(JSON.stringify({status, error, response}));
}

//TODO: Use this where necessary
function adminOnlyApi(req, res, next) {
    if (req.user.admin === 1) {
        return next();
    }
    sendRes(res, 403, null, null);
}

router.route('/:id')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            sendRes(response, 422, null, 'Beim Abrufen dieser Ausgabenliste ist ein Fehler aufgetreten')
        } else {
            con.query('SELECT id,date,name,place,value FROM expenses WHERE userid=? AND category=? AND date<=? AND date>=?;', [request.params.id, request.query.category, request.query.lastdate, request.query.firstdate], function (queryErr, queryRes) {
                if (queryErr) {
                    sendRes(response, 500, null, queryErr);
                } else {
                    sendRes(response, 200, queryRes);
                }
            });
        }
    })
    .post(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            sendRes(response, 422, null, 'Beim Ausführen dieser Abfrage ist ein Fehler aufgetreten')
        } else {
            con.query('INSERT INTO expenses (userid, category, date, name, place, value) VALUES (?, ?, ?, ?, ?, ?);', [request.params.id, request.body.category, request.body.date, request.body.product, request.body.place, request.body.value], function (queryErr, queryRes) {
                if (queryErr) {
                    sendRes(response, 500, null, queryErr);
                } else {
                    sendRes(response, 200, 'Diese Ausgabe ist erfolgreich hinzugefügt worden.');
                }
            });
        }
    });
router.route('/:id/sum')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            sendRes(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            con.query('SELECT(SELECT SUM(value) FROM expenses WHERE userid=? AND category=0 AND date<=? AND date>=?) AS sumLocal, (SELECT SUM(value) FROM expenses WHERE userid=? AND category=1 AND date<=? AND date>=?) AS sumRecurring, (SELECT SUM(value) FROM expenses WHERE userid=? AND category=2 AND date<=? AND date>=?) AS sumOnline;', [request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate], function (queryErr, queryRes) {
                if (queryErr) {
                    sendRes(response, 500, null, queryErr);
                } else {
                    sendRes(response, 200, queryRes);
                }
            });
        }
    });
router.route('/:id/sumall')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            sendRes(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            con.query('SELECT SUM(value) AS sum FROM expenses WHERE userid=? AND date<=? AND date>=?;', [request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate, request.params.id, request.query.lastdate, request.query.firstdate], function (queryErr, queryRes) {
                if (queryErr) {
                    sendRes(response, 500, null, queryErr);
                } else {
                    sendRes(response, 200, queryRes);
                }
            });
        }
    });
router.route('/:id/days')
    .get(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            sendRes(response, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            con.query('SELECT DAY(date) AS day, SUM(value) AS sum FROM expenses WHERE userid=? AND date<=? AND date>=? GROUP BY date;', [request.params.id, request.query.lastdate, request.query.firstdate], function (queryErr, queryRes) {
                if (queryErr) {
                    sendRes(response, 500, null, queryErr);
                } else {
                    sendRes(response, 200, queryRes);
                }
            });
        }
    });

module.exports = router;
