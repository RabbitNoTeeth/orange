const configFilePath = 'C:/motoko_data/globalConfig.json';
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

mkdirp.sync(path.dirname(configFilePath));
var data = fs.readFileSync(configFilePath, {flag: 'a+', encoding: 'utf8'});
if (data === '') {
    let w_data = `
    {
        "name": "XX智能装备",
        "baseURL": {
            "api": "http://localhost:9000",
            "websocket": "ws://localhost:9000/websocket"
        },
        "seriaport": {
            "rfidReader": {
                "dev": false,
                "cmdInterval": 1000,
                "comName": "COM11"
            },
            "cardReader": {
                "dev": false,
                "cmdInterval": 500,
                "comName": "COM12"
            }
        }
    }`;
    fs.writeFile(configFilePath, w_data, {flag: 'a'}, function (err) {
    });
    data = w_data;
}
const base = JSON.parse(data);
export default base;


