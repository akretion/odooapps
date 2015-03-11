'use strict';

angular.module('pickadoo')
  .controller('NavbarCtrl', function ($rootScope, $scope) {
    $scope.$watch('searchBar', function (newValue, oldValue) {
        $rootScope.filterPicking = newValue;
    });
    $rootScope.$on('$stateChangeSuccess', function (e, toState) {
        if ( toState.name == 'detail' ) {
            $scope.filterPicking = undefined;
        };
        document.querySelector("#search").focus();
    });

    $scope.doSearch = function() {
        $rootScope.search = $scope.searchBar;
        $scope.searchBar = "";
    }
  });
