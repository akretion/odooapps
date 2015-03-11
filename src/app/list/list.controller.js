'use strict';

angular.module('pickadoo')
    .controller('ListCtrl', function( $rootScope, $scope, $state, jsonRpc ) {

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

        var searchWatch = $rootScope.$watch('filterPicking', function (newValue, oldValue) {
            if (angular.isDefined(newValue)) {

                $scope.itemsFiltered = [];

                angular.forEach($rootScope.items, function(picking){
                    if ( picking.name.toLowerCase() == newValue.toLowerCase()
                         || picking.origin.toLowerCase() == newValue.toLowerCase() ) {
                        $scope.open(picking);
                    } else if ( picking.name.toLowerCase().indexOf(newValue.toLowerCase()) != -1
                                || picking.origin.toLowerCase().indexOf(newValue.toLowerCase()) != -1 ) {
                        $scope.itemsFiltered.push(picking);
                    }
                  });
            } else {
                $scope.itemsFiltered = _($rootScope.items).toArray()
            }
            $scope.itemsFiltered = _.first($scope.itemsFiltered, pickingConfig.maxList)
      });

        $scope.$on('$destroy',function() {
            searchWatch();
        });
    });
