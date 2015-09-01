'use strict';


angular.module('starter').controller('ListCtrl', ['$scope', 'production', 'warehouse', function ($scope, production, warehouse) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.mrpProduction = Object.keys(production.data).map(function (k) {
	        return production.data[k];
        });
    });
    $scope.warehouse = warehouse;
}]);
