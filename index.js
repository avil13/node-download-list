var fs = require('fs');
var ProgressBar = require('progress');
var path = require('path');
var red = require('cli-color').red;
var get = require('./libs/request');
var mkdirp = require('./libs/mkdirp');
var argumentes = require('./libs/arguments');
arg = argumentes();


var download_list = require('./' + (arg.l || arg.list)); // список файлов


if (!download_list || !download_list.name || download_list.list.length === 0) {
    console.log(red('Empty params in download list files'));
    process.exit(1);
}


// Название папки и список
var list = download_list.list;
var folder = [__dirname, 'download', download_list.name].join(path.sep);

// Имя файла
var list_copy = list.slice();
var nameL = function (el) {
    var ext = ''; // '.' + el.url.split('.').pop(); // расширение файла
    var num = '';
    var title = el.title;

    if (!title) {
        title = el.url.split('/').pop();
        ext = '';
    }

    // нужна ли нумерация
    if (download_list.autonumeration) {
        num = list_copy.indexOf(el) + 1;

        if (num < 10) {
            num = '0' + num;
        }
        num += '. ';
    }

    title = title.split(/\\|\//);
    var base_title = title.pop();

    return mkdirp(folder + path.sep + title.join('/')) + num + base_title + ext;
};


(function () {
    return new Promise(function (resolve, reject) {
        // статистикаб общий размер файлов
        // var allBytes = 0;

        // var addSize = function (i) {
        //     return function (res) {
        //         allBytes += parseInt(res.headers['content-length']);
        //         if (i == list.length - 1) {
        //             resolve(allBytes);
        //         }
        //     };
        // };

        // for (var i in list) {
        //     get(list[i].url, addSize(i), true);
        // }
        resolve(list.length);
    });
})()
.then(function (count) {
        console.log('Count files: ~', count);
        return count;
    })
    .then(function (count) {
        // Прогресс бар
        var bar = new ProgressBar(' Downloading ╣:bar╠ :percent :etas', {
            complete: '▓',
            incomplete: '░',
            width: 30,
            total: count
        });
        return bar;
    })
    .then(function (bar) {
        // Старт закачки
        (function download(list_arr) {
            if (list_arr.length === 0) {
                return false;
            }
            var el = list_arr.splice(0, 1)[0],
                path = el.url;

            var file = fs.createWriteStream(nameL(el));
            // var prev_size = 0; // Для отсчета размера файла, сохраняем его предыдущее значение
            // размер закачиваемого файла
            var _stat = function (el) {
                // fs.stat(nameL(el), function (err, stat) {
                //     var size = stat['size'];

                //     bar.tick(size - prev_size);
                //     prev_size = size;
                // });
                bar.tick(list_copy.length - list_arr.length);
            };

            // Загрузка
            get(path, function (res) {
                res.pipe(file);
                // _stat(el);

                // TODO добавить пересчет размеров скчачанных файлов
                // res.on('chunck', callback);

                // продолжаем закачку
                res.on('end', function () {
                    download(list_arr);
                    _stat(el);
                });
            });
        })(list);
    })
    .catch(function (err) {
        console.log(err);
    });
