var https = require('https');
var http = require('http');
var fs = require('fs');
var mkdirp = require('mkdirp');
var fs = require("fs");
var ProgressBar = require('progress');
var download_list = require('./list'); // список файлов

// Название папки и список
var list = download_list.list;
var folder = 'download/' + download_list.name + '/';
mkdirp(folder); // Создание папки

// Имя файла
var list_copy = list.slice();
var nameL = function(el) {
    var num = list_copy.indexOf(el) + 1;
    var ext = el.url.split('.').pop(); // расширение файла

    if (num < 10) {
        num = '0' + num;
    }
    return folder + num + '. ' + (el.title || '') + '.' + ext;
};

// Универсальный метод для загрузки по http и https
var get = function(url, callback, doNotKeepAlive) {
    var response;

    if ((/^https/g).test(url)) {
        response = https.get(url, callback);
    } else {
        response = http.get(url, callback);
    }
    if (doNotKeepAlive === true) {
        response.shouldKeepAlive = false;
    }
    return response;
};



(function() {
    return new Promise(function(resolve, reject) {
        // статистикаб общий размер файлов
        var allBytes = 0;

        var addSize = function(i) {
            return function(res) {
                allBytes += parseInt(res.headers['content-length']);
                if (i == list.length - 1) {
                    resolve(allBytes);
                }
            };
        };

        for (var i in list) {
            get(list[i].url, addSize(i), true);
        }
    });
})()
.then(function(allBytes) {
        console.log('Total size:', parseInt(allBytes / (1024 * 1024)), 'Mb');
        return allBytes;
    })
    .then(function(allBytes) {
        // Прогресс бар
        var bar = new ProgressBar(' Downloading [:bar] :percent :etas', {
            complete: '=',
            incomplete: ' ',
            width: 30,
            total: allBytes
        });
        return bar;
    })
    .then(function(bar) {
        // Старт закачки
        (function download(list_arr) {
            if (list_arr.length === 0) {
                return false;
            }
            var el = list_arr.splice(0, 1)[0],
                path = el.url;

            var file = fs.createWriteStream(nameL(el));
            var prev_size = 0; // Для отсчета размера файла, сохраняем его предыдущее значение
            // размер закачиваемого файла
            var _stat = function(el) {
                fs.stat(nameL(el), function(err, stat) {
                    var size = stat['size'];

                    bar.tick(size - prev_size);
                    prev_size = size;
                });
            };

            // Загрузка
            get(path, function(res) {
                res.pipe(file);
                _stat(el);

                // продолжаем закачку
                res.on('end', function() {
                    download(list_arr);
                    _stat(el);
                });
            });
        })(list);
    })
    .catch(function(err) {
        console.log(err);
    });
