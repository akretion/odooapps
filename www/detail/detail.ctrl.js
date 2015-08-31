'use strict';
angular.module('starter')
    .controller('DetailCtrl', ['$scope', '$stateParams', 'jsonRpc', '$state', 'production', '$ionicLoading', function ($scope, $stateParams, jsonRpc, $state, production, $ionicLoading) {
        $scope.item = production.data[$stateParams.id];
        $scope.confirm = function() {
            $ionicLoading.show({
                template: 'Validation'
            });
            jsonRpc.call('mrp.production', 'prodoo_force_production', [$scope.item.id], {})
                .then(function() {
                    jsonRpc.call('mrp.production', 'prodoo_produce', [$scope.item.id], {})
                        .then(function() {
                            delete production.data[$scope.item.id];
                            $ionicLoading.hide();
                            $state.go('list');
                        }
                    )
                }
            )
        }
}]);
