'use strict';

angular.module('pickadoo', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'mgcrea.ngStrap', 'odoo', 'buche'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('list', {
        url: '/list',
        templateUrl: 'app/list/list.html',
        controller: 'ListCtrl'
      })
      .state('detail', {
        url: '/detail/:id',
        templateUrl: 'app/detail/detail.html',
        controller: 'DetailCtrl'
      }); 
    $urlRouterProvider.otherwise('/');
  }).run(function($rootScope, $interval) {
      $rootScope.items = [];
      var update = function() {
        $rootScope.items.push(
            {
                name:'yo',
                id:1
            });
        $rootScope.items.push({
                name:'ya',
                id:2
            });
        $rootScope.items.push({
                name:'yi',
                id:3
            });
        $rootScope.items.push({
                name:'yu',
                id:4
            });
      }

      $interval(update,1000);
    });
