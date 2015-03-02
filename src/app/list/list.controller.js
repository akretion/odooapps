'use strict';

angular.module('pickadoo')
    .controller('ListCtrl', function( $rootScope, $scope, $state ) {
        $scope.open = function (item) {
            $state.go('detail', {id:item.id});
        };
    });
