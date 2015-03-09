'use strict';

angular.module('pickadoo')
  .controller('NavbarCtrl', function ($rootScope, $scope) {
    $scope.$watch('searchPicking', function (newValue, oldValue) {
        $rootScope.searchPicking = newValue;
    });
    $rootScope.$on('$stateChangeSuccess', function (e, toState) {
        if ( toState.name == 'detail' ) {
            $scope.searchPicking = undefined;
        };
        document.querySelector("#search").focus();
    });

    $scope.doSearch = function() {
        $rootScope.search = $scope.searchPicking;
        console.log($rootScope.search);
        $scope.searchPicking = "";
    }
  });
