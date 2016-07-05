angular.module( 'buche' )
  .directive('bucheRegister',function () {
    return {
      scope: false,
      restrict: 'EA',
      templateUrl: 'components/register/register.html',
      link: function ( $scope, $element, attrs ) {

        $scope.lengthWasEnough = false;

        function loadAttributes( scopeName, attr, defaultValue ) {

          if (defaultValue)
            $scope[scopeName] = defaultValue;

          if ($scope[attr])
            $scope[scopeName] = attr ? $scope[attr] : $scope[scopeName];
          else
            $scope[scopeName] = (undefined !== attr) ? attr : $scope[scopeName];

        }

        loadAttributes('bucheRegister',attrs.bucheRegisterCb);
        loadAttributes('buchePasswordLength',parseInt(attrs.buchePasswordLength), 8);
        loadAttributes('checkPasswordForSecurity',attrs.bucheSecurityCheck,function() {return false;});
        loadAttributes('bucheLoginTooltipPlacement',attrs.bucheLoginTooltipPlacement,'right');
        loadAttributes('bucheLoginTooltipText',attrs.bucheLoginTooltipText,'Tooltip text');
        loadAttributes('buchePasswordTooltipPlacement',attrs.buchePasswordTooltipPlacement,'right');
        loadAttributes('buchePasswordTooltipText',attrs.buchePasswordTooltipText,'Tooltip text');
        loadAttributes('bucheNoConfirm',!!attrs.bucheNoConfirm,false);

        $scope.$watch('bucheRegPassword', function ( newValue, oldValue ) {
          if ( !$scope.lengthWasEnough && angular.isDefined(newValue)) {

            if ( newValue.length < $scope.buchePasswordLength ||
              $scope.checkPasswordForSecurity( newValue )) {

              $scope.bucheRegisterForm.passwordInput.$error.passwordWarning = true;

            } else {

              $scope.lengthWasEnough = true;
              $scope.bucheRegisterForm.passwordInput.$error.passwordWarning = false;
              $scope.bucheRegisterForm.passwordInput.$success = true;

            }
          } else if ( angular.isDefined( newValue ) ) {
            $scope.bucheRegisterForm.passwordInput.$error.passwordError = newValue.length < $scope.buchePasswordLength ||
              $scope.checkPasswordForSecurity(newValue);
            $scope.bucheRegisterForm.passwordInput.$success = !$scope.bucheRegisterForm.passwordInput.$error.passwordError;

          }
        });

        function setupTooltip( input ) {

          angular.element($element).find('input#'+input).on('focus',function() {

            angular.element(this).tooltip({container:'body',trigger:'focus'});
            angular.element(this).tooltip('show');
            angular.element(this).off('focus');

          });

        }

        if ( !attrs.bucheNoTooltip ) {

          if (!attrs.bucheLoginNoTooltip) {
            setupTooltip('loginInput');
          }

          if (!attrs.buchePasswordNoTooltip) {
            setupTooltip('registerPasswordInput');
          }

        }

      }
    }
  })
