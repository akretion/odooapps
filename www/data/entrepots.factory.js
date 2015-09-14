'use strict';


angular.module('starter').factory('Entrepots', ['$q', 'jsonRpc', 'localStorage', function ($q, jsonRpc, localStorage) {

  var promiseAll = null;
  var promiseSelected = null;
  return {
    getAll: function() {
      promiseAll = promiseAll || jsonRpc.call('receivoo', 'get_picking_type', []).then(function(result) {
        return result;
      }, function (error) {
        console.log('une erreur est survenue', error);
        promiseAll = null; //force refresh next time
        return $q.reject(error);
      });
      return promiseAll;
    },
    get: function() {
      promiseSelected = promiseSelected || localStorage.get('reception.entrepot');
      return promiseSelected;
    },
    set: function(entrepot) {
      promiseSelected = null;
      return localStorage.set('reception.entrepot', entrepot);
    },
    getById: function(entrepotId) {
      return this.getAll().then(function (entrepots) {
        console.log('voici les entrepots', entrepots);
        return entrepots.filter(function (e) {
          return e.id == entrepotId;
        }).pop();
      });
    }
  };

}]);
