// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ui.router', 'odoo', 'akaLogin'])

.run(['$ionicPlatform', '$rootScope', '$state', function($ionicPlatform, $rootScope, $state) {
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
    $state.go('logout');
  };
}])
.run(['jsonRpc','$state', function (jsonRpc, $state) {
  jsonRpc.errorInterceptors.push(function (a) {
      console.log('Error: ',a);
      $state.go('login');
  });
}])
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('entrepot', {
    url: '/entrepot',
    templateUrl: 'entrepot/entrepot.html',
    controller: 'EntrepotCtrl'
  })
  .state('fournisseur', {
    url: '/entrepot/{warehouseId}',
    templateUrl: 'fournisseur/fournisseur.html',
    controller: 'FournisseurCtrl',
  })
  .state('reception', {
    url: '/entrepot/{warehouseId}/fournisseur/{fournisseurId}/{bonDeLivraison}',
    templateUrl: 'reception/reception.html',
    controller: 'ReceptionCtrl'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  })
  .state('logout', {
    url: '/logout',
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });

  $urlRouterProvider.otherwise('/entrepot');
}]);
