'use strict';


angular.module('starter').controller('ScanCtrl', ['$scope', 'jsonRpc', function ($scope, jsonRpc) {
    $scope.picker_name = null    
    $scope.pickings = {}

    $scope.doSearch = function() {
        $scope.message = ''
        var scan = $scope.scan
        $scope.scan = ""
        if (scan.substring(0, 3) == 'PK/') {
            jsonRpc.searchRead(
                'res.partner',
                [['is_picker', '=', true], ['ref', '=', scan]],
                ['id', 'name']
            ).then(function(response) {
                if (response.length) {
                    var picker = response.records[0]
                    $scope.picker_id = picker.id;
                    $scope.picker_name = picker.name;
                } else {
                    $scope.message = 'Aucun preparateur trouvé'
                }
            })
        } else if (!$scope.picker_id) {
            $scope.message = 'Veuillez scanner votre badge'
        } else {
            jsonRpc.searchRead(
                'stock.picking.out',
                [['name', '=', scan]],
                ['id', 'name', 'picker_id']
            ).then(function(response) {
                if (response.length) {
                    var record = response.records[0]
                    if (record.id in $scope.pickings) {
                        $scope.message = 'Commande déjà scannée'
                    } else {
                        $scope.pickings[record.id] = record;
                    }
                } else {
                    $scope.message = 'Aucune commande trouvée';
                }
            })
        }
    }

    $scope.remove = function(pickingId) {
        delete $scope.pickings[pickingId];
    }
}]);
