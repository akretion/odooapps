angular.module( 'buche' )
  .controller( 'MainCtrl', function ( $scope ) {
    $scope.login = function () {
      alert('yeah login');
      $scope.bucheLoginForm.result = {$error: {credentials:true}};
      $scope.bucheLoginForm.loginInput.$error = {doesntExist:true};
      $scope.bucheLoginForm.passwordWarning = true;
    }

    $scope.register = function () {
      alert('yeah register');
    }
  });
