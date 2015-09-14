'use strict';
angular.module('starter')
.controller('EntrepotCtrl', ['$scope', '$state', 'Entrepots', '$q', '$ionicLoading', function ($scope, $state, Entrepots, $q, $ionicLoading) {

  $ionicLoading.show({
    template: 'Chargement'
  });

  Entrepots.getAll().then(function (entrepots) {
    $scope.entrepots = entrepots;
  }).finally($ionicLoading.hide);

  $scope.selected = null;

  $scope.$on('$ionicView.beforeEnter', function() {
    $q.all([Entrepots.getAll(), Entrepots.get()]).then(function (all) {
      var entrepots = all[0];
      var entrepot = all[1];

      if (!entrepot)
        return;

      //check that saved entrepot is still available
      entrepots.some(function (e) {
        if (e.id !== entrepot.id)
          return false;

        $scope.selected = entrepot;
        return true;
      });
    });
  });

  $scope.confirm = function() {
    Entrepots.set($scope.selected);
    $state.go('reception', {warehouseId: $scope.selected.id});
  };
}]);

angular.module('starter')
.controller('ResolveEntrepotCtrl', ['$scope', '$state', 'Entrepots', function ($scope, $state, Entrepots) {
  console.log('resulve entrepots');
  Entrepots.get().then(function (entrepot) {
    if (entrepot)
      $state.go('reception', { warehouseId: entrepot.id });
    else
      $state.go('entrepot');
  }, function (error) {
    console.log('entrepot error', error);
    if (error === 'key not found') {
      Entrepots.set(null);
      $state.go('entrepot');
    } else
      $state.go('login');
  });
}]);