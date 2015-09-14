'use strict';


angular.module('starter').factory('Fournisseurs', ['$q', 'jsonRpc', 'localStorage', 'Entrepots', function ($q, jsonRpc, localStorage, Entrepots) {

  var promiseSelected = null;
  var service = {
    getAll: function(entrepotId) {
      //no cache ! 
      if (!entrepotId)
        return null;

      return jsonRpc.call('receivoo', 'get_supplier', [entrepotId]);
    },
    get: function(fournisseurId) {
      console.log('getFournsiseur', fournisseurId);
      promiseSelected = promiseSelected || localStorage.get('reception.fournisseur');
      return promiseSelected.then(function (fournisseurInCache) {
        if (fournisseurInCache && fournisseurInCache.id == fournisseurId)
          return fournisseurInCache;

        return service.getById(fournisseurId).then(function (fournisseur) {
          service.set(fournisseur);
          return fournisseur;
        });
      });
    },
    set: function(fournisseur) {
      promiseSelected = null;
      return localStorage.set('reception.fournisseur', fournisseur);
    },
    getById: function(fournisseurId) {
      return service.getAll(Entrepots.get()).then(function (fournisseurs) {
        return fournisseurs.filter(function (f) {
          return f.id == fournisseurId;
        }).pop();
      });
    }
  };
  return service;
}]);
