let API = require('./api');

class SQL {
    static con = require('../helpers/db');

    static handleSQLError(errorCode) {
        /**
         * generates a description for sql error codes
         * @param errorCode
         * @returns {string} errorCode with appended description
         */
        //Not used?
        //Add errors
        errorCode = errorCode.code;
        switch (errorCode) {
            case 'ER_BAD_FIELD_ERROR':
                errorCode += ' Fehler in der Datenbankabfrage';
                break;
            case 'ER_ACCESS_DENIED_ERROR':
            case ' ER_WRONG_DB_ERROR':
                errorCode += ' Datenbankverbindung fehlgeschlagen. Bitte den Serveradministrator kontaktieren';
                break;
        }
        return errorCode;
    }

    static querySQL(res, stmt, data) {
        this.con.query(stmt, data, function (queryErr, queryRes) {
            if (queryErr) {
                API.sendJSONResponse(res, 500, null, API.errorMsg, queryErr);
            } else {
                API.sendJSONResponse(res, 200, queryRes);
            }
        });

    }

    static updateSQLOneRow(res, stmt, data, successMsg) {
        /**
         * updates sql entry and checks if exactly one row was changed
         * @param res           response object from middleware
         * @param stmt          sql statement
         * @param data          sql parameters (content to be inserted)
         * @param successMsg    message to respond with if insert was successfull
         */
        this.con.query(stmt, data, function (queryErr, queryRes) {
            if (queryErr) {
                API.sendJSONResponse(res, 500, null, API.errorMsg, queryErr);
            } else if (queryRes.affectedRows === 1) {
                API.sendJSONResponse(res, 200, successMsg);
            } else {
                API.sendJSONResponse(res, 500, null, API.errorMsg, queryErr);
            }
        });
    }

}

module.exports = SQL;