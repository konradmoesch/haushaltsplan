const express = require('express');
const router = express.Router();
const sql = require('../helpers/sql');
const client = require('../helpers/matrix');
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
router.route('/:id/test')
    .get(function (req,res) {
        client.startClient();
        var testRoomId = "!cJwanTIpgHDDsydkrv:matrix.konradspace.de";

        var content = {
            "body": "Nachricht von " + res.locals.user.username + ": \n" + req.query.message + "\nGesendet: " + new Date().toLocaleString('de-de'),
            "msgtype": "m.text"
        };

        client.sendEvent(testRoomId, "m.room.message", content, "",(matrixError,matrixResponse) => {
            console.log(matrixResponse);
            api.sendJSONResponse(res, 200,"Nachricht erfolgreich abgesendet", null);
            if(matrixError) {
                api.sendJSONResponse(res, 422,null, matrixError);
            }
        });
        client.stopClient();
    })

module.exports = router;
