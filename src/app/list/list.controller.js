'use strict';

angular.module('pickadoo')
    .controller('ListCtrl', function( $rootScope, $scope, $state, jsonRpc ) {
        $scope.open = function (item) {
            // We have to add a blocking call as CB will be captured
            // Before processing the expedition
            jsonRpc.call('stock.picking.out', 'start_processing', [[item.id]], {})
                .done(function(){
                    $state.go('detail', {id:item.id});
                })
                .fail(function() {
                    $state.go('list');
                    }
            )
        };
    });
