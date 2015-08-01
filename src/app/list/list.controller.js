'use strict';

angular.module('pickadoo')
    .controller('ListCtrl', function( $rootScope, $scope, $state, jsonRpc, $modal, $translate, picking) {

        $rootScope.navTitle = undefined;
        $scope.picking = picking;

        $scope.open = function (item) {
            // We have to add a blocking call as CB will be captured
            // Before processing the expedition
            jsonRpc.call('stock.picking.out', 'start_processing', [[item.id]], {})
                .then(
                    function(){
                        $state.go('detail', {id:item.id});
                    },
                    function() {
                        $state.go('list');
                    }
                );
        };

        $scope.$on('open.detail', function(e, item) {
            $scope.open(item);
        });

        var filterItem = function(val) {
            if (angular.isDefined(val)) {
                $scope.itemsFiltered = [];
                angular.forEach(picking.data, function(picking){
                    if ( picking.name.toLowerCase().indexOf(val.toLowerCase()) != -1
                                || picking.origin.toLowerCase().indexOf(val.toLowerCase()) != -1 ) {
                        $scope.itemsFiltered.push(picking);
                    }
                  });
            } else {
                $scope.itemsFiltered = _(picking.data).toArray()
            }
            $scope.itemsFiltered = _.first($scope.itemsFiltered, pickingConfig.maxList)
        }; 

        var itemsWatch = $scope.$watch('picking.timekey', function(newValue,oldValue) {
           filterItem($rootScope.filterPicking);
        });

        var filterWatch = $rootScope.$watch('filterPicking', function (newValue, oldValue) {
            filterItem(newValue);
        });

        var searchWatch = $rootScope.$watch('search', function (newValue, oldValue) {
            console.log(newValue, oldValue);
            if (angular.isDefined(newValue) && newValue.length > 0 ) {
                var selectedPicking = undefined;
                angular.forEach(picking.data, function(picking){
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
