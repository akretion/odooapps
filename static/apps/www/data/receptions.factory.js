'use strict';

angular.module('starter').factory('Receptions', ['$q', 'jsonRpc', function ($q, jsonRpc) {

  return {
    get: function(warehouseId, fournisseurId) {
      if (!fournisseurId || !warehouseId)
        return null;

      return jsonRpc.call('receivoo', 'get_incoming_move', [fournisseurId, warehouseId]);
    }
  };

}]);
