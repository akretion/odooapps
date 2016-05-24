'use strict';


angular.module('starter').factory('partner', ['$q', 'jsonRpc', function ($q, jsonRpc) {
    
    var resPartner = jsonRpc.syncImportObject({
          model: 'res.partner',
          func_key: 'auto',
          base_domain: [['customer', '=', true]],
          filter_domain: [],
          limit: 50,
          interval: 5000,
    });

    return $q(function(resolve, reject) {
        resPartner.watch(function () {
            return resolve(resPartner);
        });
    });
}]);
