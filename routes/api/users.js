let express = require('express');
let router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const con = require('../helpers/db');

function sendRes(res, status, response = null, error = null) {
    res.status(status).send(JSON.stringify({status, error, response}));
}

function isStrongPw(pw) {
    let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return regExp.test(pw);
}

//TODO: Use this where necessary
function ajaxOnly(req, res, next) {
    if (req.xhr) {
        return next();
    }
    res.sendStatus(403);
}

//TODO: Use this where necessary
function adminOnlyApi(req, res, next) {
    if (req.user.admin === 1) {
        return next();
    }
    sendRes(res, 403, null, null);
}

router.route('/')
    //get list of all users
    //TODO: Not implemented yet
    .get(adminOnlyApi, ajaxOnly, function (request, response) {
        con.query('SELECT id, username, fullname, email, admin, disabled FROM users;', function (queryErr, queryRes) {
            if (queryErr) {
                sendRes(response, 500, null, queryErr);
            } else {
                sendRes(response, 200, queryRes);
            }
        });
    })
    //create user
    .post(ajaxOnly, function (request, response) {
        if(!isStrongPw(request.body.password)) {
            sendRes(response, 500, null, 'Passwort nicht sicher genug!');
        } else {
            con.query('INSERT INTO users (username, fullname, email, admin, `password`, disabled, lastPwChange) VALUES (?, ?, ?, ?, ?, 0, NOW());', [request.body.username, request.body.fullname, request.body.email, request.body.admin, bcrypt.hashSync(request.body.password)], function (queryErr, queryRes) {
                if (queryErr) {
                    sendRes(response, 500, null, queryErr);
                } else {
                    sendRes(response, 200, 'user created successfully');
                }
            });
        }
    });
router.route('/:id')
    //get specific user
    .get(ajaxOnly, function (request, response) {
        con.query('SELECT id,username,fullname,email,admin,disabled FROM users WHERE id=? LIMIT 1;', [request.params.id], function (queryErr, queryRes) {
            if (queryErr) {
                sendRes(response, 500, null, queryErr);
            } else {
                sendRes(response, 200, queryRes);
            }
        });
    })
    //edit specific user
    .put(ajaxOnly, function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            sendRes(response, 422, null, 'Beim Bearbeiten dieses Nutzers ist ein Fehler aufgetreten')
        } else {
            con.query('UPDATE users SET username = ?, fullname = ?, email = ?, admin = ?, disabled = ? WHERE id = ? LIMIT 1;', [request.body.username, request.body.fullname, request.body.email, request.body.admin, request.body.disabled, request.params.id], function (queryErr, queryRes) {
                if (queryErr) {
                    sendRes(response, 500, null, queryErr);
                } else {
                    if (queryRes.affectedRows === 1) {
                        sendRes(response, 200, 'Benutzer wurde erfolgreich bearbeitet.');
                    } else {
                        sendRes(response, 500, null, 'an error occurred');
                    }
                }
            });
        }
    })
    //delete specific user
    //TODO: Not implemented yet
    .delete(adminOnlyApi, ajaxOnly, function (request, response) {
        if (request.params.id === '1') {
            sendRes(response, 500, null, 'Der Administrator kann nicht gelöscht werden.');
        } else {
            con.query('DELETE FROM users WHERE id = ? LIMIT 1;', [request.params.id], function (queryErr, queryRes) {
                if (queryErr) {
                    sendRes(response, 500, null, queryErr);
                } else {
                    if (queryRes.affectedRows === 1) {
                        sendRes(response, 200, 'Benutzer wurde erfolgreich gelöscht.');
                    } else {
                        sendRes(response, 500, null, 'an error occurred');
                    }
                }
            });
        }
    });
router.route('/:id/password')
    //change own password
    .put(ajaxOnly, function (request, response) {
        if (parseInt(response.locals.user.id, 10) !== parseInt(request.params.id, 10)) {
            sendRes(response, 422, null, 'Sie können über diese Funktion nur Ihr eigenes Passwort ändern.');
        } else if (!isStrongPw(request.body.newPassword)) {
            sendRes(response, 422, null, 'Das Kennwort entspricht nicht den Anforderungen.');
        } else {
            con.query('SELECT password FROM users WHERE id = ? LIMIT 1;', [request.params.id], function (queryErr, queryRes) {
                if (queryErr) {
                    sendRes(response, 500, null, 'an error occurred', queryErr);
                } else if (bcrypt.compareSync(request.body.currentPassword, queryRes[0].password)) {
                    con.query('UPDATE users SET password = ?, lastPwChange = NOW() WHERE id = ? LIMIT 1;', [bcrypt.hashSync(request.body.newPassword), request.params.id], function (queryErr, queryRes) {
                        if (queryErr) {
                            sendRes(response, 500, null, queryErr);
                        } else {
                            if (queryRes.affectedRows === 1) {
                                sendRes(response, 200, 'Passwort wurde erfolgreich geändert');
                            } else {
                                sendRes(response, 500, null, 'an error occurred');
                            }
                        }
                    });
                } else {
                    sendRes(response, 422, null, 'Das alte Passwort ist nicht korrekt.');
                }
            });
        }
    });

module.exports = router;
