'use strict';

angular.module('pickadoo')
    .controller('DetailCtrl', function( $rootScope, $scope, $stateParams ) {
        $scope.item = $rootScope.items[$stateParams.id]
    });
