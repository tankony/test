
var app = angular.module("TestModule", []);

app.controller ('TestCtrl', function($scope) {
    $scope.name = 'hogehoge';
    $scope.now = new Date();
    
    $scope.onClickbtn = function() {
        $scope.push_name = $scope.name.split(' ').reverse().join(',');
    };
});


app.controller ('TestCtrl2', function($scope) {
    $scope.name = 'hugahuga';
    
    $scope.onClickbtn = function() {
        $scope.push_name = 'independent with TestCtrl';
    };

    $scope.names = [
        'hoge',
        'huga',
        'piyo',
        'foo',
        'baa',
    ];
});

app.filter('changepiyo', function() {
    return function(input, prefix ) {
        if (typeof input != 'string') {
            return null;
        }
        input = prefix+'piyo';
        return input;
    };
});

// minifyする際は仮引数が変更されないように配列化しておく
// またはng-annotateで変換してくれるツールを使用する。
app.controller ('TestCtrl3', ['$scope', '$http', function(s,h) {
    $scope.name = $scope.name + s + h;
}]);


