'use strict';


angular.module('starter').controller('ListCtrl', ['$scope', 'fournisseurList', function ($scope, production) {

	$scope.mrpProduction = Object.keys(production.data).map(function (k) {
		return production.data[k];
	});
}]);
