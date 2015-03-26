'use strict';

angular.module('pickadoo')
    .controller('DetailCtrl', function( $rootScope, $scope, $stateParams, $state , jsonRpc, $modal, blockUI, $translate ) {

        $scope.item = $rootScope.items[$stateParams.id];
        $rootScope.navTitle = $scope.item.name + ' : ' + $scope.item.carrier_method;
        $scope.todoMoves = $scope.item.moves;
        $scope.processMoves = {};

        $translate(['PAYMENT_DONE', 'PAYMENT_PROCESSING', 'PAYMENT_FAIL', 'PAYMENT_MISSING'])
            .then(function (translations) {
                console.log($scope.item.paid);
                if ( $scope.item.paid ) {
                    $scope.paymentMessage = translations.PAYMENT_DONE;
                } else if ( $scope.item.payment_method == 'CB' ) {
                    $scope.paymentMessage = translations.PAYMENT_PROCESSING;
                    jsonRpc.call('stock.picking.out', 'capture_order', [[$scope.item.id]], {})
                        .then(
                            function(){
                                $scope.paymentMessage = translations.PAYMENT_DONE;
                                $scope.item.paid = true;
                                $rootScope.items[item.id].paid = true;
                            },
                            function(error) {
                                $scope.paymentMessage = translations.PAYMENT_FAIL + '<br/><br/>' + error.message;
                            }
                        );
                } else {
                    $scope.paymentMessage = translations.PAYMENT_MISSING;
                };
                console.log($scope.paymentMessage);
            });

        $scope.addAll = function() {
            angular.forEach($scope.todoMoves, function(move){
                $scope.moveAddQty(move.id, move.qty);
            });
        };

        $scope.moveAddAll = function( id ) {
            $scope.moveAddQty(id, $scope.todoMoves[id].qty);
        };

        $scope.moveAddOne = function( id ) {
            $scope.moveAddQty(id, 1);
        };

        $scope.moveAddQty = function( id, qty ) {
            if ( ! $scope.processMoves[id] ) {
                $scope.processMoves[id] = angular.copy($scope.todoMoves[id]);
                $scope.processMoves[id].qty = qty;
            } else {
                $scope.processMoves[id].qty += qty;
            };
            $scope.todoMoves[id].qty -= qty;
            if ( $scope.todoMoves[id].qty == 0 ) {
                delete $scope.todoMoves[id];
            };
        };

        $scope.moveCancelProcess = function( id ) {
            if ( ! $scope.todoMoves[id] ) {
                $scope.todoMoves[id] = $scope.processMoves[id];
            } else {
                $scope.todoMoves[id].qty += $scope.processMoves[id].qty;
            };
            delete $scope.processMoves[id];
        };

        $scope.cancel = function() {
            $state.go('list');
        };

        $scope.validate = function() {
            if ( $scope.item.process_in_pickadoo && $scope.item.paid ) {
                $translate(['VALIDATE_AND_PRINT']).then(function (translations) {
                    blockUI.start(translations.VALIDATE_AND_PRINT) ;
                });
                jsonRpc.call('stock.picking.out', 'process_picking', [[$scope.item.id], $scope.processMoves], {})
                    .then(
                        function(result) {
                            delete $rootScope.items[$scope.item.id];
                            $state.go('list');
                        })
                    .finally(
                        function(result) {
                            blockUI.stop();
                        }
                   );
            } else {
                $translate(['CAN_NOT_PROCESS_PICKING', 'SET_PAID_ORDER_AS_PREPARED', 'SET_CARRIER_ORDER_AS_PREPARED']).then(function (translations) {
                    var message = '';
                    if ( !$scope.item.paid ) {
                        message = translations.SET_PAID_ORDER_AS_PREPARED;
                    } else {
                        message = translations.SET_CARRIER_ORDER_AS_PREPARED;
                    };

                    var modal = $modal({
                        scope: $scope,
                        title: translations.CAN_NOT_PROCESS_PICKING,
                        content: message,
                        show: true,
                        html: false,
                        prefixEvent: 'doneModal',
                    });
                    
              })
            }
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
        
        $scope.$on('doneModal.hide',function(){
            jsonRpc.call('stock.picking.out', 'set_prepared', [[$scope.item.id]], {})
            delete $rootScope.items[$scope.item.id];
            $state.go('list');
        });

    });
