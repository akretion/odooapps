'use strict';

angular.module('pickadoo')
    .controller('ListCtrl', function( $rootScope, $scope, $state, jsonRpc, $modal, $translate ) {

        $rootScope.navTitle = undefined;

        $scope.open = function (item) {
            // We have to add a blocking call as CB will be captured
            // Before processing the expedition
            jsonRpc.call('stock.picking.out', 'start_processing', [[item.id]], {})
                .done(function(){
                    $state.go('detail', {id:item.id});
                })
                .fail(function() {
                    $state.go('list');
                });
        };

        $scope.$on('open.detail', function(e, item) {
            $scope.open(item);
        });

        var itemsWatch = $rootScope.$watch('items', function(newValue,oldValue) {
            if (angular.isDefined(newValue) && _.keys(newValue).length > 0) {
                $scope.itemsFiltered = _.first(_($rootScope.items).toArray(),pickingConfig.maxList);
                itemsWatch();
            }
        }, true);

        var filterWatch = $rootScope.$watch('filterPicking', function (newValue, oldValue) {
            console.log('SEARCH FILTER');
            if (angular.isDefined(newValue)) {

                $scope.itemsFiltered = [];

                angular.forEach($rootScope.items, function(picking){
                    if ( picking.name.toLowerCase().indexOf(newValue.toLowerCase()) != -1
                                || picking.origin.toLowerCase().indexOf(newValue.toLowerCase()) != -1 ) {
                        $scope.itemsFiltered.push(picking);
                    }
                  });
            } else {
                $scope.itemsFiltered = _($rootScope.items).toArray()
            }
            $scope.itemsFiltered = _.first($scope.itemsFiltered, pickingConfig.maxList)
        });

        var searchWatch = $rootScope.$watch('search', function (newValue, oldValue) {
            console.log('search');
            console.log(newValue, oldValue);
            if (angular.isDefined(newValue) && newValue.length > 0 ) {
                var selectedPicking = undefined;
                angular.forEach($rootScope.items, function(picking){
                    if ( picking.name.toLowerCase() == newValue.toLowerCase()
                         || picking.origin.toLowerCase() == newValue.toLowerCase() ) {
                        selectedPicking = picking;
                    }
                });

                if ( selectedPicking ) {
                    $scope.open(selectedPicking);
                } else {
                    $translate(['USER_ERROR', 'NO_ORDER_FOUND']).then(function (translations) {
                        $modal({
                            title: translations.USER_ERROR,
                            content: translations.NO_ORDER_FOUND,
                            show: true,
                            html: false,
                        });
                    });
                };
                $rootScope.search = "";
            };
        });

        $scope.$on('$destroy',function() {
            filterWatch();
            searchWatch();
        });
    });
