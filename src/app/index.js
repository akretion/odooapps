'use strict';

angular.module('pickadoo', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'mgcrea.ngStrap', 'odoo', 'buche', 'blockUI', 'smart-table'])
  .config(function ($stateProvider, $urlRouterProvider, jsonRpcProvider, $modalProvider, blockUIConfig) {
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
      }); 
    $urlRouterProvider.otherwise('/login');
    blockUIConfig.autoBlock = false;

  }).run(function($rootScope, $interval, jsonRpc, $state, $cookies, $modal) {
        $rootScope.modal = function(data) {
            $modal(data);
        };

        $rootScope.items = {};
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

        $rootScope.timekey = ""
        // TODO move this code in odoo lib
        var getData = function (timekey) {
            if ( $cookies.session_id && $cookies.session_id !== "") {
                jsonRpc.call('stock.picking.out', 'get_sync_data', [
                    'pickadoo', $rootScope.timekey, [['type', '=', 'out'], ['state', 'in', ['confirmed', 'assigned']]], 50
                ], {}).then(
                    function(result) {
                        var res = result[0];
                        $rootScope.timekey = result[1];
                        var remove_ids = result[2];
                        if(!$.isEmptyObject(res)) {
                            angular.extend($rootScope.items, res);
                            getData($rootScope.timekey);
                        }
                        if(!$.isEmptyObject(remove_ids)) {
                            //console.log("We should remove this ids", remove_ids);
                        }
                    })
                }
            };

        getData();

        $interval(getData, 1000);
    });
