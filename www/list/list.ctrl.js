'use strict';


angular.module('starter').controller('ListCtrl', ['$scope', 'partner', function ($scope, partner) {
	$scope.resPartner = partner.data;
}]);
