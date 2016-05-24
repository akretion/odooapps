// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ui.router', 'odoo', 'akaLogin'])

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
.run(['jsonRpc','$state', '$rootScope', function (jsonRpc, $state, $rootScope) {
  $rootScope.logout = function() {
    $state.go('logout');
  };

  jsonRpc.errorInterceptors.push(function (a) {
      console.log(a);
      $state.get('login').data.errors.push(a);
      $state.go('login');
  });
}])
.config(['$stateProvider','$urlRouterProvider' , function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('list', {
    url: '/',
    templateUrl: 'list/list.html',
    controller: 'ListCtrl',
    resolve: {
      partner: 'partner'
    }
  }).state('detail', {
    url: '/detail/{id}',
    templateUrl: 'detail/detail.html',
    controller: 'DetailCtrl',
    resolve: {
      partner: 'partner'
    }
  }).state('login', {
    url: '/login',
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl',
    data: {
      errors: []
    }
  }).state('logout', {
    url: '/logout',
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
  $urlRouterProvider.otherwise('/');
}]);
