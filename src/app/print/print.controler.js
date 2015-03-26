'use strict';

angular.module('pickadoo')
    .controller('PrintCtrl', function( $rootScope, $scope, $state, jsonRpc, $modal, $translate ) {

        $rootScope.navTitle = "Re-impression";

        var searchWatch = $rootScope.$watch('search', function (newValue, oldValue) {
            console.log('search');
            console.log(newValue, oldValue);
            if (angular.isDefined(newValue) && newValue.length > 0 ) {
                jsonRpc.call('stock.picking.out', 'print_from_number', [newValue], {})
                    .then(
                        function(){
                            $scope.message = "Print in progress";
                        },
                        function(error) {
                            $scope.message = "Fail to print";
                        }
                    )
            };
        });

        $scope.$on('$destroy',function() {
            searchWatch();
        });
    });
