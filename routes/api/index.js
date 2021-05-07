const express = require('express');
const router = express.Router();
const sql = require('../helpers/sql');
const client = require('../helpers/matrix');
const api = require('../helpers/api');

router.route('/:id/sendMessage')
    .post(function (req,res) {
        if (parseInt(res.locals.user.id, 10) !== parseInt(req.params.id, 10)) {
            api.sendJSONResponse(res, 422, null, 'Beim Abrufen dieser Daten ist ein Fehler aufgetreten')
        } else {
            client.startClient();
            let testRoomId = "!cJwanTIpgHDDsydkrv:matrix.konradspace.de";

            let content = {
                "body": "Nachricht von " + res.locals.user.username + ": \n" + req.body.message + "\nGesendet: " + new Date().toLocaleString('de-de'),
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
        }
    })

module.exports = router;
