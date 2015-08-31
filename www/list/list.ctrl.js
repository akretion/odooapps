'use strict';


angular.module('starter').controller('ListCtrl', ['$scope', 'production', function ($scope, production) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.mrpProduction = Object.keys(production.data).map(function (k) {
	        return production.data[k];
        });
    })
}]);
