'use strict';

angular.module('pickadoo')
    .controller('DetailCtrl', function( $rootScope, $scope, $stateParams, $state , jsonRpc, $modal) {
        $scope.item = $rootScope.items[$stateParams.id]
        $scope.todoMoves = $rootScope.items[$stateParams.id].moves
        $scope.processMoves = {}

        $scope.add_all = function() {
            angular.extend($scope.processMoves, $scope.todoMoves);
            $scope.todoMoves = {}
        };
        $scope.move_add_all = function( id ) {
            $scope.processMoves[id] = $scope.todoMoves[id];
            delete $scope.todoMoves[id];

        };
        $scope.move_add_one = function( id ) {
            $scope.processMoves = $scope.todoMoves;
            $scope.todoMoves = {}
        };
        $scope.move_cancel_process = function( id ) {
            $scope.todoMoves[id] = $scope.processMoves[id];
            delete $scope.processMoves[id];
        };

        $scope.cancel = function() {
            $state.go('list');
        };

        $scope.validate = function() {
            console.log('Validate Picking');
            jsonRpc.call('stock.picking.out', 'process_picking', [[$scope.item.id], $scope.processMoves], {})
                .done(function(result) {
                    delete $rootScope.items[$scope.item.id];
                    $state.go('list');
                })
        };

        $scope.$watch('todoMoves', function (newValue, oldValue) {
            console.log(newValue);
            if ( angular.equals({}, newValue) ) {
                console.log('We should validate the picking');
                $scope.validate();
            }
        }, true);

    });
