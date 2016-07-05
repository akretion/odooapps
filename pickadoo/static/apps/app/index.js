'use strict';

angular.module('pickadoo', ['ngAnimate', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'mgcrea.ngStrap', 'odoo', 'blockUI', 'smart-table', 'pascalprecht.translate',])
  .config(function ($stateProvider, $urlRouterProvider, jsonRpcProvider, $modalProvider, blockUIConfig, $translateProvider) {
    $stateProvider
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
    $urlRouterProvider.otherwise('/list');
    blockUIConfig.autoBlock = false;
    $translateProvider
        .translations('fr', window.translateFR)
        .preferredLanguage('fr');

  }).run(function($rootScope, $interval, jsonRpc, $state, $modal) {
        // Redirect to odoo login page if not connected
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                jsonRpc.isLoggedIn(true).then(
					function(result) {
                        console.log(result);
						if (!result) {
                            window.location = '/'
						}
					}
				)
			}
		)
        $state.go('list');
     });
