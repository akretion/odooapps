'use strict';

angular.module('pickadoo')
    .controller('DetailCtrl', function( $rootScope, $scope, $stateParams, $state , jsonRpc, $modal, blockUI ) {

        $scope.item = $rootScope.items[$stateParams.id];
        $rootScope.navTitle = $scope.item.name;
        $scope.todoMoves = $scope.item.moves;
        $scope.processMoves = {};

        $scope.addAll = function() {
            angular.extend($scope.processMoves, $scope.todoMoves);
            $scope.todoMoves = {};
        };
        $scope.moveAddAll = function( id ) {
            $scope.processMoves[id] = $scope.todoMoves[id];
            delete $scope.todoMoves[id];

        };
        $scope.moveAddOne = function( id ) {
            $scope.processMoves[id] = $scope.todoMoves[id];
            delete $scope.todoMoves[id];
        };
        $scope.moveCancelProcess = function( id ) {
            $scope.todoMoves[id] = $scope.processMoves[id];
            delete $scope.processMoves[id];
        };

        $scope.cancel = function() {
            $state.go('list');
        };

        $scope.validate = function() {
            console.log('Validate Picking');
            blockUI.start();
            jsonRpc.call('stock.picking.out', 'process_picking', [[$scope.item.id], $scope.processMoves], {})
                .done(function(result) {
                    delete $rootScope.items[$scope.item.id];
                    $state.go('list');
                })
                .always(function(result) {
                    blockUI.stop();
                });
        };

        $scope.$watch('todoMoves', function (newValue, oldValue) {
            console.log(newValue);
            if ( angular.equals({}, newValue) ) {
                console.log('We should validate the picking');
                $scope.validate();
            }
        }, true);

        var searchWatch = $rootScope.$watch('search', function (newValue, oldValue) {
            if (angular.isDefined(newValue)) {
                console.log('youoouh');
                console.log(newValue);
                angular.forEach($scope.todoMoves, function(move){
                    if ( move.product.ean == newValue ) {
                        $scope.move_add_one(move.id);
                    }
                });
            };
        });

        $scope.$on('$destroy',function() {
            searchWatch();
        });
    });
