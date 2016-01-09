# node-download-list

Скрипт для скачивания списка файлов из интернета.

Для его работы необходим JSON файл `list.json` в котором будет массив со ссылками для скачивания и названия файлов и еще навзвание папки куда это все будет качаться.


Пример этого файла выглядит вот так:
```json

{
    "name": "Название папки",
    "list": [{
            "url": "http://url/to/file",
            "title":"Название файла"
        }]
}
```
Если у вас такой файл есть, то вперед и с песней!

В консоли выполняем слейдующее:
```
git clone https://github.com/avil13/node-download-list
cd node-download-list
npm install
```
Закидываем свой файл `list.json` вместо того, котрый здесь для примера и начинаем скачивать при помощи команды:

```
node index.js
```
В ходе вы полнения будет показываться прогрессбар со статусом загрузки:
```
$ node index.js
Total size: ~ 175 Mb
 Downloading [░░░                           ] 9% 848.7s
```
Размеры вычисляются не точно.

Все сохраняется в папку `download`
