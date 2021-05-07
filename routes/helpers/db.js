const sqldb = require('mysql');
const dbconf = require('../../config/db.json');
const dbpool = sqldb.createPool({
    host: dbconf.host,
    user: dbconf.username,
    password: dbconf.password,
    database: dbconf.database,
    dateStrings: true
});

module.exports = dbpool;
