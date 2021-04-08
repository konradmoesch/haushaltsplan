let express = require('express');
let router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const mysql = require('mysql');
const con = require('../helpers/db');

function sendRes(res, status, response = null, error = null) {
    res.status(status).send(JSON.stringify({status, error, response}));
}

function isStrongPw(pw) {
    let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return regExp.test(pw);
}

function adminOnlyApi(req, res, next) {
    if (req.user.admin === 1) {
        return next();
    }
    sendRes(res, 403, null, null);
}

router.route('/')
    .get(adminOnlyApi, function (request, response) {
        con.query('SELECT id, username, fullname, email, admin, disabled FROM users;', function (queryErr, queryRes) {
            if (queryErr) {
                sendRes(response, 500, null, queryErr);
            } else {
                sendRes(response, 200, queryRes);
            }
        });
    })
    //.post(adminOnlyApi, function (request, response) {
    .post( function (request, response) {
        if(!isStrongPw(request.body.password)) {
            sendRes(response, 500, null, 'Passwort nicht sicher genug!');
        } else {
            con.query('INSERT INTO users (username, fullname, email, admin, `password`, disabled) VALUES (?, ?, ?, ?, ?, 0);', [request.body.username, request.body.fullname, request.body.email, request.body.admin, bcrypt.hashSync(request.body.password)], function (queryErr, queryRes) {
                if (queryErr) {
                    sendRes(response, 500, null, queryErr);
                } else {
                    sendRes(response, 200, 'user created successfully');
                }
            });
        }
    });
router.route('/:id')
    .get(function (request, response) { //get specific user
        con.query('SELECT id,username,fullname,email,admin,disabled FROM users WHERE id=? LIMIT 1;', [request.params.id], function (queryErr, queryRes) {
            if (queryErr) {
                sendRes(response, 500, null, queryErr);
            } else {
                sendRes(response, 200, queryRes);
            }
        });
    })
    .post(adminOnlyApi, function (request, response) { //change password
        con.query('UPDATE users SET password = ? WHERE id = ? LIMIT 1;', [bcrypt.hashSync(request.body.password), request.params.id], function (queryErr, queryRes) {
            if (queryErr) {
                sendRes(response, 500, null, queryErr);
            } else {
                if (queryRes.affectedRows === 1) {
                    sendRes(response, 200, 'password changed successfully');
                } else {
                    sendRes(response, 500, null, 'an error occurred');
                }
            }
        });
    })
    //.put(adminOnlyApi, function (request, response) { //edit specific user
    .put(function (request, response) { //edit specific user
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
    })
    .delete(adminOnlyApi, function (request, response) { //delete specific user
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

module.exports = router;
