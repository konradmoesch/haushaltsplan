class API {
    constructor() {
    }

    static sendJSONResponse(res, status, response = null, error = null) {
        res.status(status).send(JSON.stringify({status, error, response}));
    }

    static adminOnlyApi(req, res, next) {
        if (req.user.admin === 1) {
            return next();
        }
        sendJSONResponse(res, 403, null, null);
    }

    static doQuery() {

    }
}

module.exports = API;