'use strict';

angular.module('pickadoo')
    .controller('DetailCtrl', function( $rootScope, $scope, $stateParams, $state ) {
        $scope.item = $rootScope.items[$stateParams.id]
        $scope.todoMoves = $rootScope.items[$stateParams.id].moves
        $scope.processMoves = []

        $scope.add_all = function() {
            $scope.processMoves = $scope.todoMoves;
            $scope.todoMoves = []
        };
        $scope.move_add_all = function( index ) {
            $scope.processMoves.push($scope.todoMoves[index]);
            $scope.todoMoves.splice(index, 1);
        };
        $scope.add_all = function( index ) {
            $scope.processMoves = $scope.todoMoves;
            $scope.todoMoves = []
        };
        $scope.move_cancel_process = function( index ) {
            $scope.todoMoves.push($scope.processMoves[index]);
            $scope.processMoves.splice(index, 1);
        };

        $scope.cancel = function() {
            $state.go('list');
        };

        $scope.partial = function() {
            console.log('Do partial');
        };




    });
