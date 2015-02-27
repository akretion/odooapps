'use strict';

angular.module('pickadoo')
  .controller('NavbarCtrl', function ($rootScope, $scope) {
    $scope.$watch('searchPicking', function (newValue, oldValue) {
        if (angular.isDefined(newValue)) {
            $rootScope.searchPicking = newValue;
        }
        });
  });
