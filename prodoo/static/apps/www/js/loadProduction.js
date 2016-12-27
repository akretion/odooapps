'use strict';

angular.module('starter').factory('loadProduction', ['production', '$ionicLoading', function (production, $ionicLoading) {
    // Show a loading message while waiting results from server
    // Can by used in (angular-ui) states'resolve
    // it's a wraper around data/production

    $ionicLoading.show({
          template: 'Chargement'
    });

    return production.then(function (result) {
      $ionicLoading.hide(); 
      return result;
    });
}]);