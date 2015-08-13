// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ui.router', 'odoo'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.run(['jsonRpc','$state', function (jsonRpc, $state) {
  jsonRpc.errorInterceptors.push(function (a) {
      $state.go('login');
  });

}])
.config(['$stateProvider','$urlRouterProvider' , function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('list', {
    url: '/',
    templateUrl: 'list/list.html',
    controller: 'ListCtrl',
    resolve: {
      production: 'production'
    }
  }).state('detail', {
    url: '/detail/{id}',
    templateUrl: 'detail/detail.html',
    controller: 'DetailCtrl',
    resolve: {
      production: 'production'
    }
  }).state('login', {
    url: '/login',
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
  $urlRouterProvider.otherwise('/');
}]);

'use strict';


angular.module('starter').controller('ListCtrl', ['$scope', 'production', function ($scope, production) {

	$scope.mrpProduction = Object.keys(production.data).map(function (k) {
		return production.data[k];
	});
}]);

'use strict';
angular.module('starter')
    .controller('DetailCtrl', ['$scope', '$stateParams', 'jsonRpc', '$state', 'production', function ($scope, $stateParams, jsonRpc, $state, production) {
        $scope.item = production.data[$stateParams.id];
        $scope.confirm = function() {
            jsonRpc.call('mrp.production', 'prodoo_produce', [$scope.item.id], {})
                .then(function() {
                    delete production.data[$scope.item.id];
                    $state.go('list');
                }
            )
        }
}]);

'use strict';

angular.module('starter').controller('LoginCtrl', ['$scope', 'jsonRpc', '$state', function ($scope, jsonRpc, $state) {
    $scope.login = {
        'db': 'db',
        'username':'admin'
    };

	$scope.submit = function () {
		jsonRpc.login(
            $scope.login.db,
            $scope.login.username,
            $scope.login.password
        ).then(function (a) {
			$state.go('list');
		}, function(e) {
			$scope.errorMessage = e.message;
		});
	}
}]);

'use strict';


angular.module('starter').factory('production', ['$q', 'jsonRpc', function ($q, jsonRpc) {
    
    var mrpProduction = jsonRpc.syncImportObject({
          model: 'mrp.production',
          func_key: 'auto',
          domain: [['state', 'in', ['ready']]],
          limit: 50,
          interval: 5000,
    });

    return $q(function(resolve, reject) {
        mrpProduction.watch(function () {
            return resolve(mrpProduction);
        });
    });
}]);