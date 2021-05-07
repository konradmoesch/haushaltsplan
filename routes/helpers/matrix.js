const sdk = require('matrix-js-sdk')
const matrixconf = require('../../config/matrix.json');
const client = sdk.createClient(matrixconf.host);
client.login("m.login.password", {"user": matrixconf.username, "password": matrixconf.password}).then((response) => {
});

module.exports = client;