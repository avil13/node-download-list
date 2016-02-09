var App = angular.module('APP', [])

.directive('editor', [function() {
    return {
        restrict: 'E',
        templateUrl: '/editor.html',
        scope: {
            el: '='
        }
    };
}])

.controller('MainCtrl', ['$scope', function($scope) {
    $scope.el = {}; // название и ссылка слева

    $scope.content = {
        autonumeration: true,
        name: 'Название списка',
        list: []
    };

    $scope.add = function() {
        $scope.content.list.push($scope.el);
        $scope.el = {};
    };
    $scope.del = function(el) {
        $scope.content.list.splice($scope.content.list.indexOf(el), 1);
    };
    $scope.save = function() {
        save($scope.content, 'list.json');
    };

    function save(data, filename) {

        if (!data) {
            console.error('Console.save: No data');
            return;
        }

        if (!filename) filename = 'console.json';

        if (typeof data === "object") {
            data = JSON.stringify(data, undefined, 4);
        }

        var blob = new Blob([data], {
                type: 'text/json'
            }),
            e = document.createEvent('MouseEvents'),
            a = document.createElement('a');

        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    };
}]);
