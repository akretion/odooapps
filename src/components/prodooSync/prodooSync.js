'use strict';

angular.module('pickadoo').factory('picking', ['$q', 'jsonRpc', function ($q, jsonRpc) {
   
    var picking = jsonRpc.syncImportObject({
        model: 'stock.picking.out',
        func_key: 'pickadoo',
        domain: [
            ['type', '=', 'out'],
            ['state', 'in', ['assigned']],
            '|',
                ['prepared', '=', false], 
                '&',
                    '&',
                        ['prepared', '=', true],
                        ['carrier_id.process_in_pickadoo', '=', true],
                    ['paid', '=', true]
            ],
        limit: 50,
        interval: window.pickingConfig.refresh_interval,
        });

    return $q(function(resolve, reject) {
        picking.watch(function () {
            return resolve(picking);
        });
    });
}]);
