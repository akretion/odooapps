'use strict';

angular.module('pickadoo')
    .controller('PrintCtrl', function( $rootScope, $scope, $state, jsonRpc, $modal, $translate ) {

        $translate(['DIRECT_PRINT'])
            .then(function (translations) {
                $rootScope.navTitle = translation.DIRECT_PRINT;
            })
        $scope.messages = []

        var searchWatch = $rootScope.$watch('search', function (newValue, oldValue) {
            console.log('search');
            console.log(newValue, oldValue);
            if ( angular.isDefined(newValue) && newValue.length > 0 ) {
                $rootScope.search = "";
                console.log('NEW VALS');
                $translate([
                    'MANUAL_PRINT_PROCESSING',
                    'MANUAL_PRINT_FAIL',
                    'MANUAL_NO_PICKING',
                    'MANUAL_PRINT_ERROR',
                ], {
                    number: newValue,
                }).then(function (translations) {
                    jsonRpc.call('stock.picking.out', 'print_from_number', [newValue], {})
                        .then(
                            function(){
                                $scope.messages.unshift(translations.MANUAL_PRINT_PROCESSING);
                            },
                            function(error) {
                                if ( error.title == "http" ) {
                                    $scope.messages.unshift(translations.MANUAL_PRINT_FAIL);
                                } else if ( error.data && error.data.cups_error ) {
                                    $scope.messages.unshift(translations.MANUAL_PRINT_ERROR);
                                } else {
                                    $scope.messages.unshift(translations.MANUAL_NO_PICKING);
                                }
                            }
                        )
                })
                $scope.messages = $scope.messages.slice(0, 15);
            };
        });

        $scope.$on('$destroy',function() {
            searchWatch();
        });
    });
