'use strict';

angular.module('starter').controller('ListCtrl', ['$scope', 'production', 'Warehouse', function ($scope, production, Warehouse) {
    $scope.warehouses = [];
    $scope.search = { warehouse: null };

    refreshProduction(); //init (before watch)
    production.watch(refreshProduction); //on each sync

    function refreshProduction() {
        $scope.mrpProduction = Object.keys(production.data).map(function (k) {
            return production.data[k];
        });
    }

    //load warehouse list
    Warehouse.getAll().then(function (ws) { $scope.warehouses = ws; });
    //select the last used 
    Warehouse.get().then(function (w) { $scope.search.warehouse = w; });

    //save the last warehouse checked
    $scope.$on('$ionicView.beforeLeave', function() {
        if ($scope.search.warehouse)
            Warehouse.set($scope.search.warehouse);
    });    
}]);
