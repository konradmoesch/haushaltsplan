const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
con = require('./db');

function logLogin(userID, authOk, clientInfo) {
    con.query('INSERT INTO users_login_history (userID, authOk, `client`) VALUES (?, ?, ?)', [userID, authOk, clientInfo]);
}

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        con.query('SELECT id, username, fullname, email FROM users WHERE id = ?', [id], function (err, rows) {
            done(err, rows[0]);
        });
    });
    passport.use('local-login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            let clientInfo = req.headers['user-agent'] + ' IP: ' + req.ip;
            con.query('SELECT id, `password` FROM users WHERE username = ? and disabled = 0', [username], function (err, rows) {
                if (err) {
                    return done(err);
                }
                if (!rows.length || !bcrypt.compareSync(password, rows[0].password)) {
                    let userIDLog = null;
                    if (rows.length) {
                        userIDLog = rows[0].id;
                    }
                    logLogin(userIDLog, 0, clientInfo);
                    return done(null, false);
                }
                logLogin(rows[0].id, 1, clientInfo);
                return done(null, rows[0]);
            });
        })
    );
};
