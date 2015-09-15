'use strict';


angular.module('starter').factory('Warehouse', ['$q', 'jsonRpc', 'localStorage', function ($q, jsonRpc, localStorage) {

  var promiseAll = null;
  var promiseSelected = null;
  var service = {
    getAll: function() {
      promiseAll = promiseAll || jsonRpc.call('prodoo', 'get_warehouse', []).then(function(result) {
        return result;
      }, function (error) {
        console.log('une erreur est survenue', error);
        promiseAll = null; //force refresh next time
        return $q.reject(error);
      });
      return promiseAll;
    },
    get: function(entrepotId) {
      //entrepotId is probably comming for stateParams

      //let's see if we have something in cache
      promiseSelected = promiseSelected || localStorage.get('production.entrepot');

      return promiseSelected.then(function (entrepotInCache) {

        //check if it's the one we want
        if (entrepotInCache && entrepotInCache.id == entrepotId)
          return entrepotInCache;

        //no entrepotId provided, need to check if the one in cache
        //is in the server list 
        if (entrepotInCache && !entrepotId)
          return service.getById(entrepotInCache.id);

        //entrepotInCache = null or id !=
        //refresh from server and try to get one with id we want 
        return service.getById(entrepotId).then(function(entrepot) {
          service.set(entrepot); //set cache
          return entrepot;
        });
      });
    },
    set: function(entrepot) {
      promiseSelected = null; //fore refresh
      return localStorage.set('production.entrepot', entrepot);
    },
    getById: function(entrepotId) {
      //get entrepot from the server
      return service.getAll().then(function (entrepots) {
        console.log('voici les entrepots', entrepots);
        return entrepots.filter(function (e) {
          return e.id == entrepotId;
        }).pop();
      });
    }
  };
  return service;

}]);
