'use strict';

angular.module('pickadoo')
    .controller('DetailCtrl', function( $rootScope, $scope, $stateParams, $state ) {
        $scope.item = $rootScope.items[$stateParams.id]
        $scope.todoMoves = $rootScope.items[$stateParams.id].moves
        $scope.processMoves = {}

        $scope.add_all = function() {
            $scope.processMoves = $scope.todoMoves;
            $scope.todoMoves = {}
        };
        $scope.move_add_all = function( id ) {
            $scope.processMoves[id] = $scope.todoMoves[id];
            delete $scope.todoMoves[id];
            console.log($scope.todoMoves);
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

        $scope.partial = function() {
            console.log('Do partial');
        };




    });
