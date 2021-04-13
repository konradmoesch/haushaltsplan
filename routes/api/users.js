const express = require('express');
const router = express.Router();
const con = require('../helpers/db');
const bcrypt = require('bcrypt-nodejs');
const api = require('../helpers/api');

function isStrongPw(pw) {
    let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return regExp.test(pw);
}

router.route('/')
    //get list of all users
    //TODO: Not implemented yet
    .get(api.adminOnlyApi, function (request, response) {
        con.query('SELECT id, username, fullname, email, admin, disabled FROM users;', function (queryErr, queryRes) {
            if (queryErr) {
                api.sendJSONResponse(response, 500, null, queryErr);
            } else {
                api.sendJSONResponse(response, 200, queryRes);
            }
        });
    })
    //create user
    .post(function (request, response) {
        if(!isStrongPw(request.body.password)) {
            api.sendJSONResponse(response, 500, null, 'Passwort nicht sicher genug!');
        } else {
            con.query('INSERT INTO users (username, fullname, email, admin, `password`, disabled, lastPwChange) VALUES (?, ?, ?, ?, ?, 0, NOW());', [request.body.username, request.body.fullname, request.body.email, request.body.admin, bcrypt.hashSync(request.body.password)], function (queryErr, queryRes) {
                if (queryErr) {
                    api.sendJSONResponse(response, 500, null, queryErr);
                } else {
                    api.sendJSONResponse(response, 200, 'user created successfully');
                }
            });
        }
    });
router.route('/:id')
    //get specific user
    .get(function (request, response) {
        con.query('SELECT id,username,fullname,email,admin,disabled FROM users WHERE id=? LIMIT 1;', [request.params.id], function (queryErr, queryRes) {
            if (queryErr) {
                api.sendJSONResponse(response, 500, null, queryErr);
            } else {
                api.sendJSONResponse(response, 200, queryRes);
            }
        });
    })
    //edit specific user
    .put(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Beim Bearbeiten dieses Nutzers ist ein Fehler aufgetreten')
        } else {
            con.query('UPDATE users SET username = ?, fullname = ?, email = ?, admin = ?, disabled = ? WHERE id = ? LIMIT 1;', [request.body.username, request.body.fullname, request.body.email, request.body.admin, request.body.disabled, request.params.id], function (queryErr, queryRes) {
                if (queryErr) {
                    api.sendJSONResponse(response, 500, null, queryErr);
                } else {
                    if (queryRes.affectedRows === 1) {
                        api.sendJSONResponse(response, 200, 'Benutzer wurde erfolgreich bearbeitet.');
                    } else {
                        api.sendJSONResponse(response, 500, null, 'an error occurred');
                    }
                }
            });
        }
    })
    //TODO: Not implemented yet
    //delete specific user
    .delete(api.adminOnlyApi, function (request, response) {
        if (request.params.id === '1') {
            api.sendJSONResponse(response, 500, null, 'Der Administrator kann nicht gelöscht werden.');
        } else {
            con.query('DELETE FROM users WHERE id = ? LIMIT 1;', [request.params.id], function (queryErr, queryRes) {
                if (queryErr) {
                    api.sendJSONResponse(response, 500, null, queryErr);
                } else {
                    if (queryRes.affectedRows === 1) {
                        api.sendJSONResponse(response, 200, 'Benutzer wurde erfolgreich gelöscht.');
                    } else {
                        api.sendJSONResponse(response, 500, null, 'an error occurred');
                    }
                }
            });
        }
    });
router.route('/:id/password')
    //change own password
    .put(function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            api.sendJSONResponse(response, 422, null, 'Sie können über diese Funktion nur Ihr eigenes Passwort ändern.');
        } else if (!isStrongPw(request.body.newPassword)) {
            api.sendJSONResponse(response, 422, null, 'Das Kennwort entspricht nicht den Anforderungen.');
        } else {
            con.query('SELECT password FROM users WHERE id = ? LIMIT 1;', [request.params.id], function (queryErr, queryRes) {
                if (queryErr) {
                    api.sendJSONResponse(response, 500, null, queryErr);
                } else if (bcrypt.compareSync(request.body.currentPassword, queryRes[0].password)) {
                    con.query('UPDATE users SET password = ?, lastPwChange = NOW() WHERE id = ? LIMIT 1;', [bcrypt.hashSync(request.body.newPassword), request.params.id], function (query2Err, query2Res) {
                        if (query2Err) {
                            api.sendJSONResponse(response, 500, null, query2Err);
                        } else {
                            if (query2Res.affectedRows === 1) {
                                api.sendJSONResponse(response, 200, 'Passwort wurde erfolgreich geändert');
                            } else {
                                api.sendJSONResponse(response, 500, null, 'an error occurred');
                            }
                        }
                    });
                } else {
                    api.sendJSONResponse(response, 422, null, 'Das alte Passwort ist nicht korrekt.');
                }
            });
        }
    });

module.exports = router;
