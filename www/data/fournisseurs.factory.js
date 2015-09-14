'use strict';


angular.module('starter').factory('Fournisseurs', ['$q', 'jsonRpc', 'localStorage', function ($q, jsonRpc, localStorage) {
  var promiseAll = null;
  var promiseSelected = null;
  return {
    getAll: function(entrepotId) {

      if (!entrepotId)
        return null;

      return jsonRpc.call('receivoo', 'get_supplier', [entrepotId]);
    },
    get: function() {
      promiseSelected = promiseSelected || localStorage.get('reception.fournisseur');
      return promiseSelected;
    },
    set: function(fournisseur) {
      promiseSelected = null;
      return localStorage.set('reception.fournisseur', fournisseur);
    },
    getById: function(fournisseurId) {
      return this.getAll().then(function (fournisseurs) {
        console.log('voici les fournisseurs', fournisseurs);
        return fournisseurs.filter(function (f) {
          return f.id == fournisseurId;
        }).pop();
      });
    }
  };
}]);
