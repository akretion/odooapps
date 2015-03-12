'use strict';

angular.module('pickadoo')
    .controller('DetailCtrl', function( $rootScope, $scope, $stateParams, $state , jsonRpc, $modal, blockUI, $translate ) {

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
            blockUI.start( "{{ 'VALIDATE_PRINT | translate }}" ) ;
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
            if ( angular.equals({}, newValue) ) {
                $scope.validate();
            }
        }, true);

        var searchWatch = $rootScope.$watch('search', function (newValue, oldValue) {
            var selectedMove = undefined;
            if (angular.isDefined(newValue) && newValue.length > 0 ) {
                angular.forEach($scope.todoMoves, function(move){
                    if ( move.product.ean == newValue ) {
                        selectedMove = move;
                    }
                });
                $rootScope.search = "";
                if ( selectedMove ) {
                    $scope.moveAddOne(selectedMove.id);
                } else {
                    $translate(['USER_ERROR', 'NO_PRODUCT_FOUND']).then(function (translations) {
                        $modal({
                            title: translations.USER_ERROR,
                            content: translations.NO_PRODUCT_FOUND,
                            show: true,
                            html: false,
                        });
                    });
                }
            };
        });

        $scope.$on('$destroy',function() {
            searchWatch();
        });
    });
