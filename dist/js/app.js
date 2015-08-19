// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ui.router', 'odoo', 'ngCookies'])

.run(function($ionicPlatform, $rootScope, jsonRpc, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $rootScope.logout = function() {
    jsonRpc.logout(true);
    $state.go('login');
  };
})
.run(['jsonRpc','$state', function (jsonRpc, $state) {
  jsonRpc.errorInterceptors.push(function (a) {
      $state.go('login');
  });

}])
.config(['$stateProvider','$urlRouterProvider' , function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('reception', {
    url: '/reception/{warehouseId}',
    templateUrl: 'reception/reception.html',
    controller: 'ReceptionCtrl',
  }).state('list', {
    url: '/list/{fournisseurId}/{warehouseId}/{bonDeLivraison}',
    templateUrl: 'list/list.html',
    controller: 'ListCtrl as list'
  }).state('login', {
    url: '/login',
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  }).state('entrepot', {
    url: '/entrepot',
    templateUrl: 'entrepot/entrepot.html',
    controller: 'EntrepotCtrl',
    resolve: {
      entrepots: 'entrepots'
    }
  });
  $urlRouterProvider.otherwise('/login');
}]);

'use strict';


angular.module('starter').controller('ListCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', 'fournisseurList', 'jsonRpc', '$cookies', '$ionicSideMenuDelegate', function ($scope, $stateParams, $state, $ionicLoading, fournisseurList, jsonRpc, $cookies, $ionicSideMenuDelegate) {

  this.validList = [];

  this.search = {
    name: {}
  };

  $ionicLoading.show({
    template: 'chargement'
  });

  $scope.$on('$ionicView.beforeEnter', angular.bind(this, function() {
    fournisseurList($stateParams.fournisseurId, $stateParams.warehouseId)
      .then(angular.bind(this, function(result) {
        this.stockList = result;
        $ionicLoading.hide();
      }));

    this.entrepotName = decodeURIComponent($cookies.get('reception.entrepot.name'));
    this.entrepotName = this.entrepotName.charAt(0) + this.entrepotName.slice(1).toLowerCase();

    this.fournisseurName = decodeURIComponent($cookies.get('reception.fournisseur.name'));

    this.bonDeLivraison = decodeURIComponent($stateParams.bonDeLivraison);

    $scope.$apply();
  }));

  function findIndex(array, test) {
    var length = array.length,
    index = -1;

    while (++index < length) {
      if (test(array[index])) {
        return index;
      }
    }
    return -1;
  }

  $scope.$on('valid.amount', angular.bind(this, function(e, amount, id) {
    var index = findIndex(this.validList, function(currItem) {
        return currItem.id === id;
    });

    this.validList[index].product_qty = amount;

    var indexStock = findIndex(this.stockList, function(currItem) {
        return currItem.id === id;
    });

    if (indexStock !== -1) {
      var item = this.stockList[indexStock];

      item.product_qty = Math.max(
        0, Math.min(
          item.original_product_qty - amount, item.original_product_qty
        )
      );

      this.validList[index].overboard = amount - item.original_product_qty;

      if (amount === 0) {
        this.validList.splice(index, 1);
      }
    }
  }));

  this.getEntrepotName = function() {
    return this.entrepotName;
  };

  this.getFournisseurName = function() {
    return this.fournisseurName;
  };

  this.goBack = function() {
    $state.go('reception', {warehouseId: $stateParams.warehouseId});
  }

  this.doTransfer = function() {

    $ionicLoading.show({
      template: 'Validation'
    });

    var argsList = [[], decodeURIComponent($stateParams.bonDeLivraison)];
    angular.forEach(this.validList, function(item) {
      argsList[0].push({
        id: item.id,
        product_qty: item.product_qty
      });
    });

    jsonRpc.call('receivoo', 'do_incoming_transfer', argsList)
      .then(function() {
        $ionicLoading.hide();
        $state.go('reception', {warehouseId: $stateParams.warehouseId});
      });
  };

  this.removeFromValid = function( item ) {

    var index = findIndex(this.validList, function(currItem) {
        return currItem.id === item.id;
      });

      if (index !== -1) {
        this.validList.splice(index, 1);

        var indexStock = findIndex(this.stockList, function(currItem) {
            return currItem.id === item.id;
        });

        this.stockList[indexStock].product_qty = this.stockList[indexStock].original_product_qty;
      }
  };

  this.putOnValid = function( item ) {
    if (item.product_qty > 0) {
      var index = findIndex(this.validList, function(currItem) {
        return currItem.id === item.id;
      });

      if ( index === -1 ) {
        var newItem = angular.copy(item);
        newItem.product_qty = 1;
        this.validList.unshift(newItem);

        if (item.notify_add_item) {
          jsonRpc.call('receivoo', 'notify_add_item', [item]);
        }
      }
      else {
        this.validList[index].product_qty++;
      }
      if (item.original_product_qty === undefined) {
        item.original_product_qty = item.product_qty;
      }
      item.product_qty--;
    }
  };

}]);

'use strict';
angular.module('starter')
.controller('ReceptionCtrl', ['$scope', '$state', '$stateParams', '$ionicLoading', '$cookies', 'fournisseurs', function ($scope, $state, $stateParams, $ionicLoading, $cookies, fournisseurs) {

  $ionicLoading.show({
    template:'Chargement'
  });


  var warehouseId;

  $scope.$on('$ionicView.beforeEnter', function() {

    if (!$cookies.get('reception.entrepot.id') && !$stateParams.warehouseId) {
      $state.go('entrepot');
    }
    else if (!$cookies.get('reception.entrepot.id')) {
      $cookies.put('reception.entrepot.id', $stateParams.warehouseId);
    }

    $scope.entrepotName = decodeURIComponent($cookies.get('reception.entrepot.name'));
    $scope.entrepotName = $scope.entrepotName.charAt(0) + $scope.entrepotName.slice(1).toLowerCase();
    warehouseId = $stateParams.warehouseId || $cookies.get('reception.entrepot.id');
    $scope.$apply();
  });

  $scope.goBack = function() {
    $state.go('entrepot');
  };


  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.selected = undefined;
    $scope.bonLivraison = undefined;


    fournisseurs(warehouseId)
      .then(function(result) {
        $ionicLoading.hide();
        $scope.fournisseurs = result;
      });
  });


  $scope.confirm = function() {
    $cookies.put('reception.fournisseur.name', $scope.selected.name);
    $state.go('list', {
      fournisseurId: $scope.selected.id,
      warehouseId: warehouseId,
      bonDeLivraison: encodeURIComponent($scope.bonLivraison)
    });
    return;
  };
}]);

'use strict';
angular.module('starter')
.controller('EntrepotCtrl', ['$scope', '$state', 'entrepots', '$cookies', function ($scope, $state, entrepots, $cookies) {

  $scope.entrepots = entrepots;
  $scope.$on('$ionicView.beforeEnter', function() {
    angular.forEach($scope.entrepots, function(entrepot) {
      if (entrepot.id === parseInt($cookies.get('reception.entrepot.id'))) {
        $scope.selected = entrepot;
      }
    });
  });

  $scope.confirm = function() {
    $cookies.put('reception.entrepot.id', $scope.selected.id);
    $cookies.put('reception.entrepot.name', $scope.selected.name);
    $state.go('reception', {warehouseId: $scope.selected.id});
    return;
  };
}]);

'use strict';

angular.module('starter').controller('LoginCtrl', ['$scope', 'jsonRpc', '$state', function ($scope, jsonRpc, $state) {
    $scope.login = {
        'db': 'db',
        'username':'admin'
    };

	$scope.submit = function () {
		jsonRpc.login(
            $scope.login.db,
            $scope.login.username,
            $scope.login.password
        ).then(function (a) {
			$state.go('entrepot');
		}, function(e) {
			$scope.errorMessage = e.message;
		});
	}
}]);

'use strict';

angular.module('starter').factory('fournisseurs', ['$q', 'jsonRpc', function ($q, jsonRpc) {
    return function(pickingType) {

      return $q(function(resolve, reject) {
        var partners = jsonRpc.call('receivoo', 'get_supplier', [parseInt(pickingType)])
          .then(function(result) {
            resolve(result);
          })
         .catch(function(err) {
            reject(err);
          });
      });
    };

}]);

'use strict';

angular.module('starter').factory('fournisseurList', ['$q', 'jsonRpc', function ($q, jsonRpc) {

  return function(fournisseurId, warehouseId) {
    return $q(function(resolve, reject) {
      jsonRpc.call('receivoo', 'get_incoming_move', [parseInt(fournisseurId), parseInt(warehouseId)])
        .then(function(result) {
          resolve(result);
        })
       .catch(function(err) {
          reject(err);
        });
    });
  };
}]);

'use strict';


angular.module('starter').factory('entrepots', ['$q', 'jsonRpc', '$ionicLoading', function ($q, jsonRpc, $ionicLoading) {

  $ionicLoading.show({
    template: 'Chargement'
  });

  return $q(function(resolve, reject) {
    jsonRpc.call('receivoo', 'get_picking_type', [])
      .then(function(result) {
        $ionicLoading.hide();
        resolve(result);
      })
     .catch(function(err) {
        $ionicLoading.hide();
        reject(err);
      });
  });
}]);

'use strict';

angular.module('starter')
.directive('digitKeyboard', [ function() {
  return {
    restrict: 'A',
    scope: {
      show:'=',
      itemId:'='
    },
    replace: true,
    templateUrl: 'digit-keyboard/digit-keyboard.html',
    link: function($scope, $element) {
      $scope.amount = '';
      
      $scope.addToAmount = function( digitToAdd ) {
        $scope.amount += digitToAdd;
      }

      $scope.supprimer = function() {
        $scope.amount = $scope.amount.substr(0, $scope.amount.length - 1);
      }

      $scope.clearAmount = function() {
        $scope.amount = '';
      }

      $scope.validate = function() {
        $scope.$emit('valid.amount', parseInt($scope.amount), $scope.itemId);
        $scope.show = false;
        $scope.amount = '';
      }

      $scope.closeKeyboard = function() {
        $scope.show = false;
        $scope.amount = '';
      }
    }
  }
}])
