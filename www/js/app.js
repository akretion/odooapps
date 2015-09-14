// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ui.router', 'odoo', 'ngCookies'])

.run(function($ionicPlatform, $rootScope, jsonRpc, $state) {
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

  $rootScope.logout = function() {
    jsonRpc.logout(true);
    $state.go('login');
  };
})
.run(['jsonRpc','$state', function (jsonRpc, $state) {
  jsonRpc.errorInterceptors.push(function (a) {
      $state.go('login');
  });

}])
.config(['$stateProvider','$urlRouterProvider' , function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('reception', {
    url: '/reception/{warehouseId}',
    templateUrl: 'reception/reception.html',
    controller: 'ReceptionCtrl',
  })
  .state('list', {
    url: '/list/{fournisseurId}/{warehouseId}/{bonDeLivraison}',
    templateUrl: 'list/list.html',
    controller: 'ListCtrl as list'
  }).state('login', {
    url: '/login',
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  }).state('logout', {
    url: '/logout',
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  }).state('entrepot', {
    url: '/entrepot',
    templateUrl: 'entrepot/entrepot.html',
    controller: 'EntrepotCtrl'
  }).state('resolveWarehouse', {
    url: '/',
    controller: 'ResolveEntrepotCtrl'
  });
  $urlRouterProvider.otherwise('/');
}]);
