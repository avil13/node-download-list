var https = require('https');
var http = require('http');
var url = require('url');
var fs = require('fs');
var arguments = require('./arguments');

var arg = arguments();

// Универсальный метод для загрузки по http и https
module.exports = function (url_path, callback, doNotKeepAlive = false) {
    var req_obj = url.parse(url_path);

    if (arg.c || arg.cookie) {
        req_obj['headers'] = {
            Cookie: fs.readFileSync((arg.c || arg.cookie), 'utf8')
        };
    }

    var response = (req_obj.protocol === 'https:' ? https : http)
        .get(req_obj, callback);

    if (doNotKeepAlive === true) {
        response.shouldKeepAlive = false;
    }
};
