'use strict';

angular.module('pickadoo', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'mgcrea.ngStrap', 'odoo', 'buche', 'blockUI', 'smart-table', 'pascalprecht.translate',])
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
        controller: 'ListCtrl'
      })
      .state('detail', {
        url: '/detail/:id',
        templateUrl: 'app/detail/detail.html',
        controller: 'DetailCtrl'
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

  }).run(function($rootScope, $interval, jsonRpc, $state, $cookies, $modal) {

        jsonRpc.errorInterceptors.push(function(data) {
            $modal({
                title: data.error,
                show: true,
                content: data.message,
                html: true,
            });
        });

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                if ( ! $cookies.session_id && toState.name !== 'login' ) {
                    event.preventDefault();
                    $state.go('login');
                } else if ( $cookies.session_id
                        && ( toState.name === 'login'
                             || ( toState.name === 'detail' && fromState.name !== 'list' )
                           )
                          ) {
                    event.preventDefault();
                    $state.go('list');
                }
            })

        $state.go('login');
        
        $rootScope.picking = jsonRpc.syncImportObject({
            model: 'stock.picking.out',
            func_key: 'pickadoo',
            domain: [
                ['type', '=', 'out'],
                ['state', 'in', ['assigned']],
                '|',
                    ['prepared', '=', false], 
                    '&',
                        '&',
                            ['prepared', '=', true],
                            ['carrier_id.process_in_pickadoo', '=', true],
                        ['paid', '=', true]
                ],
            limit: 50,
            interval: window.pickingConfig.refresh_interval,
            });
     });
