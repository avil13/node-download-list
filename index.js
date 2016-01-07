var https = require('https');
var http = require('http');
var fs = require('fs');
var mkdirp = require('mkdirp');
var ProgressBar = require('progress');
var download_list = require('./list'); // список файлов

// Название папки и список
var list = download_list.list;
var folder = 'download/' + download_list.list_name + '/';
mkdirp(folder); // Создание папки

// Прогресс бар
var bar = new ProgressBar('  Downloading [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: list.length
});


// Имя файла
var list_copy = list.slice();
var nameL = function(name) {
    var num;
    for (num = list_copy.length; num--;) {
        if (list_copy[num].title === name) {
            break;
        }
    }
    ++num;
    if (num < 10) {
        num = '0' + num;
    }
    return num + '. ' + name;
};


// Старт закачки
(function download(list_arr) {
    bar.tick(1);

    if (list_arr.length === 0) {
        return false;
    }
    var el = list_arr.splice(0, 1),
        name = el[0].title,
        path = el[0].url;

    var file = fs.createWriteStream(folder + nameL(name) + '.mp4');
    var request;

    // Загрузка
    var response = function(res) {
        res.pipe(file);
        // продолжаем закачку
        res.on('end', function() {
            download(list_arr);
        });
    };

    if ((/^https/g).test(path)) {
        request = https.get(path, response);
    } else {
        request = http.get(path, response);
    }
})(list);