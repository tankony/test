
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

app.controller ('TestCtrl3', function($scope, $http) {
    
    $http({method: 'GET', url: './members.json'})
    .success(function(data, status, headers, config) {
        $scope.members = data;
        console.log(data);
        console.log(status);
        console.log(headers('content-type'));
        console.log(config);
    })
    .error(function() {
        $scope.members = 'error';
    });


//    $http.get('./members.json')
//    .success(function(data) {
//        console.log(data);
//    })
//    .error(function(err) {
//        console.log(err);
//    });
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
// app.controller ('TestCtrl3', ['$scope', '$http', function(s,h) {
//     $scope.name = $scope.name + s + h;
// }]);

/*
 *  recipes####################################
 */

/*
 *  value
 */
app.value('valuesample', [
    {"name": "hoge", "age": 29},
    {"name": "huga", "age": 31},
    {"name": "piyo", "age": 33},
    {"name": "foo", "age": 31},
    {"name": "boo", "age": 43}
]);

app.controller('ValueCtrl', function($scope, valuesample) {
    $scope.values = valuesample;
});

/*
 * constant
 */
app.constant('CONSTANT_VAL', 'This is constant value.');

app.controller('ConstantCtrl', function($scope, CONSTANT_VAL) {
    $scope.constant_value = CONSTANT_VAL;
});

/*
 * factory
 */
app.factory('counter', function() {
    return {
        count: 0,

        increment: function() {
            this.count++;
        },

        add: function(count) {
            this.count += count; 
        }
    };
});

app.controller('FactoryCtrl', function($scope, counter) {
    $scope.counter = counter;
});

/*
 * service
 */
// instance fancion
function Counter() {
    this.count = 0;
};

// prototype functions
Counter.prototype.increment = function() {
    this.count++;
};

Counter.prototype.add = function(count) {
    this.count += count;
};

app.service('service_counter', Counter);

// equal
// app.factory('service_counter', function() {
//     return new Counter();
// });

app.controller('ServiceCtrl', function($scope, service_counter) {
    $scope.counter = service_counter;
});


/*
 * provider
 */
app.provider('provider_counter', function() {
    var count = 0;

    this.setDefaultCount = function(defaultCount) {
        count = defaultCount;
    };

    this.$get = function() {
        return {
            count: count,
            
            increment: function() {
                this.count++;
            },
            add: function(count) {
                this.count += count; 
            }
        };
    };

});

app.constant('COUNTER_DEFAULT', 100);

app.config(function(provider_counterProvider, COUNTER_DEFAULT) {
    provider_counterProvider.setDefaultCount(COUNTER_DEFAULT);
});

app.controller('ProviderCtrl', function($scope, provider_counter, valuesample) {
    $scope.counter = provider_counter;
    $scope.value = valuesample;

    $scope.changename = function() {
        valuesample[0].name = 'hogehoge';
    };
});

/*
 *  directive sample
 */
app.directive('testAlert', function($window) {
    return {
        link: function(scope, element, attrs) {
             var message = attrs.message; 

             console.log(element);
             console.log(attrs);

             element.on('click', function() {
                $window.alert(message);
             });
        }
    };
});


app.directive('testBtn', function() {

    return {
    
        restrict: 'E',

        // template
        template:
            '<span class="my-test">' +
            '   <i class="fa fa-{{icon}}"></i>' +
            '   <span>{{label}}</span>' +
            '</span>',

        // 別ファイルとして読み込むことも可能
        // template: 'tmplate/test-btn.tpl',
        
        replace: true,

        scope: true,

        link: function(scope, element, attrs) {
            scope.icon = attrs.icon;
            scope.label = attrs.label;
        }
    };
});


/*
 *  controllerで定義したfunctionをローカルディレクティブで利用できる
 *  isolate scope
 */
app.directive('testBtnGroup', function() {
    return {
        restrict: 'E',
        scope: {
            labels: '=',
            onSelect: '&'
        },
        replace: true,
        template:
            '<span class="test-btnGroup">' +
            '   <span' +
            '       ng-repeat="label in labels"' +
            '       ng-class="{ \'is-selected \': $index === currentIndex}"' + 
            '       ng-click="select($index, label)"' +
            '   >{{label}}</span>' +
            '</span>',
        link: function(scope, element) {
            scope.currentIndex = 0;
            scope.select = function($index, label) {
                scope.currentIndex = $index;
                scope.onSelect({index: $index, label: label});
            }
        }
    };
});

app.controller('isolateCtrl', function($scope) {
    $scope.showAlert = function(index, label) {
        alert('index: '+ index +', label: '+ label);
    };
});

/*  ディレクティブ内容の要素をtemplateに使えるように
 *  directive - transclude
 */
app.directive('testTransclude', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            icon: '@'
        },
        template:
            '<span class="test-btn">' +
            '   <i class="fa fa-{{icon}}"></i>' +
            '   <span ng-transclude></span>' +
            '</span>'
    };
});



