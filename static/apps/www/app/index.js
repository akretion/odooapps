'use strict';

angular.module('pickadoo', ['ngAnimate', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'mgcrea.ngStrap', 'odoo', 'buche', 'blockUI', 'smart-table', 'pascalprecht.translate',])
  .config(function ($stateProvider, $urlRouterProvider, jsonRpcProvider, $modalProvider, blockUIConfig, $translateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('list', {
        url: '/list',
        templateUrl: 'app/list/list.html',
        controller: 'ListCtrl',
        resolve: {
          picking: 'picking'
          }
      })
      .state('detail', {
        url: '/detail/:id',
        templateUrl: 'app/detail/detail.html',
        controller: 'DetailCtrl',
        resolve: {
          picking: 'picking'
          }
      }).state('print', {
        url: '/print',
        templateUrl: 'app/print/print.html',
        controller: 'PrintCtrl'
      })
 ; 
    $urlRouterProvider.otherwise('/login');
    blockUIConfig.autoBlock = false;
    $translateProvider
        .translations('fr', window.translateFR)
        .preferredLanguage('fr');

  }).run(function($rootScope, $interval, jsonRpc, $state, $modal) {

        $state.go('login');
     });
