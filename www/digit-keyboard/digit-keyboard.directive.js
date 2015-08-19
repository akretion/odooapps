'use strict';

angular.module('starter')
.directive('digitKeyboard', [ function() {
  return {
    restrict: 'A',
    scope: {
      show:'=',
      itemId:'='
    },
    replace: true,
    templateUrl: 'digit-keyboard/digit-keyboard.html',
    link: function($scope, $element) {
      $scope.amount = '';
      
      $scope.addToAmount = function( digitToAdd ) {
        $scope.amount += digitToAdd;
      }

      $scope.supprimer = function() {
        $scope.amount = $scope.amount.substr(0, $scope.amount.length - 1);
      }

      $scope.clearAmount = function() {
        $scope.amount = '';
      }

      $scope.validate = function() {
        $scope.$emit('valid.amount', parseInt($scope.amount), $scope.itemId);
        $scope.show = false;
        $scope.amount = '';
      }

      $scope.closeKeyboard = function() {
        $scope.show = false;
        $scope.amount = '';
      }
    }
  }
}])
