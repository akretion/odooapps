'use strict';

angular.module('pickadoo')
    .controller('ListCtrl', function( $rootScope, $scope, $state ) {
        $scope.open = function (item, index) {
            $state.go('detail', {id:index});
        };
    });
