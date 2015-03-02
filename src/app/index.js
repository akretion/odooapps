'use strict';

angular.module('pickadoo', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'mgcrea.ngStrap', 'odoo', 'buche'])
  .config(function ($stateProvider, $urlRouterProvider, jsonRpcProvider) {
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

  }).run(function($rootScope, $interval, jsonRpc, $state, $cookies) {
        $rootScope.items = {};

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                if ( ! $cookies.session_id && toState.name !== 'login' ) {
                    event.preventDefault();
                    $state.go('login');
                } else if ( $cookies.session_id && toState.name === 'login') {
                    event.preventDefault();
                    $state.go('list');
                }
            })

        // TODO move this code in odoo lib
        var getData = function (timekey) {
            if ( $cookies.session_id && $cookies.session_id !== "") {
                console.log("Call Odoo for getting data", timekey);
                jsonRpc.call('stock.picking.out', 'get_sync_data', [
                    'pickadoo', timekey, [], 50
                ], {}).then(
                    function(result) {
                        var res = result[0];
                        var timekey = result[1];
                        var remove_ids = result[2];
                        if(!$.isEmptyObject(res)) {
                            console.log("Data found update scope", res);
                            angular.extend($rootScope.items, res);
                            getData(timekey);
                        } else {
                            console.log("No data found stop synchronisation");
                        }
                        if(!$.isEmptyObject(remove_ids)) {
                            console.log("We should remove this ids", remove_ids);

                        }
                    })
                }
            };

        console.log("====== FIRST CALL ========");
        getData();

        console.log("====== START ========");
        $interval(getData, 1000);
    });
