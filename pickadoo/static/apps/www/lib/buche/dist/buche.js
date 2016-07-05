'use strict';

angular.module('buche',['ngMessages']);

'use strict';

angular.module( 'buche' )
  .controller( 'BucheLoginCtrl', ["$scope", function ( $scope ) {
  }]);

angular.module( 'buche' )
  .directive('bucheLogin',function () {
    return {
      scope: false,
      restrict: 'EA',
      templateUrl: 'components/login/login.html',
      controller: 'BucheLoginCtrl',
      link: function ( $scope, $element, attrs ) {

        function loadAttributes( scopeName, attr, defaultValue ) {

          if (defaultValue)
            $scope[scopeName] = defaultValue;

          if ($scope[attr])
            $scope[scopeName] = attr ? $scope[attr] : $scope[scopeName];
          else
            $scope[scopeName] = (undefined !== attr) ? attr : $scope[scopeName];

        }

        loadAttributes('bucheLogin',attrs.bucheLoginCb);
        loadAttributes('forgotUsernameText',attrs.bucheForgotUsernameText,'Forgotten your username ?');
        loadAttributes('forgotUsernameLink',attrs.bucheForgotUsernameLink,'about:blank');
        loadAttributes('forgotPasswordText',attrs.bucheForgotPasswordText,'Forgotten your password ?');
        loadAttributes('forgotPasswordLink',attrs.bucheForgotPasswordLink,'about:blank');
        loadAttributes('bucheLoginTooltipPlacement',attrs.bucheLoginTooltipPlacement,'right');
        loadAttributes('bucheLoginTooltipText',attrs.bucheLoginTooltipText,'Tooltip text');
        loadAttributes('buchePasswordTooltipPlacement',attrs.buchePasswordTooltipPlacement,'right');
        loadAttributes('buchePasswordTooltipText',attrs.buchePasswordTooltipText,'Tooltip text');

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
            setupTooltip('passwordInput');
          }

        }

      }
    }
  })

'use strict';

angular.module( 'buche' )
  .controller( 'BucheRegisterCtrl', ["$scope", function ( $scope ) {

  }])

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

angular.module("buche").run(["$templateCache", function($templateCache) {$templateCache.put("components/register/register.html","<div><h2>Register</h2><form class=\"form\" name=\"bucheRegisterForm\"><div class=\"form-group\" ng-class=\"{\'has-error\':bucheRegisterForm.loginInput.$error.alreadyUsed || bucheRegisterForm.login.$error.noRespect}\"><input name=\"loginInput\" type=\"text\" class=\"form-control\" placeholder=\"username\" ng-model=\"bucheRegUsername\" required=\"\"></div><div class=\"form-group\" ng-class=\"{\'has-error\':bucheRegisterForm.emailInput.$error}\"><input type=\"text\" class=\"form-control\" placeholder=\"Email address\" ng-model=\"bucheRegEmail\" required=\"\"></div><div class=\"form-group\" ng-class=\"{\'has-warning\':bucheRegisterForm.passwordInput.$error.passwordWarning,\'has-success\':bucheRegisterForm.passwordInput.$success,\'has-error\':bucheRegisterForm.passwordInput.$error.passwordError}\"><input type=\"password\" name=\"passwordInput\" id=\"registerPasswordInput\" class=\"form-control\" placeholder=\"Password\" ng-model=\"bucheRegPassword\" required=\"\" data-toggle=\"tooltip\" data-placement=\"{{buchePasswordTooltipPlacement}}\" title=\"{{buchePasswordTooltipText}}\"></div><div ng-if=\"!bucheNoConfirm\" class=\"form-group\" ng-class=\"{\'has-warning\':bucheRegisterForm.confirmPasswordInput.$error.warning,\'has-success\':bucheRegisterForm.confirmPasswordInput.$success,\'has-error\':bucheRegisterForm.confirmPasswordInput.$error.error}\"><input name=\"confirmPasswordInput\" type=\"password\" class=\"form-control\" placeholder=\"Password confirmation\" ng-model=\"bucheRegPasswordConfirm\" required=\"\"></div><div ng-messages=\"bucheRegisterForm.result.$error\"><div ng-message=\"confirmation\">Le mot de passe ne correspond pas a l\'identifiant</div></div><button class=\"btn btn-primary\" ng-click=\"bucheRegisterCb()\" ng-disabled=\"bucheRegisterForm.$invalid\">Register</button></form></div>");
$templateCache.put("components/login/login.html","<div><h2>Login</h2><form class=\"form\" name=\"bucheLoginForm\" id=\"buche-login-form\"><div class=\"form-group\" ng-class=\"{\'has-error\':bucheLoginForm.loginInput.$error.doesntExist}\"><input name=\"loginInput\" id=\"loginInput\" type=\"text\" class=\"form-control\" placeholder=\"username\" ng-model=\"bucheUsername\" required=\"\" data-toggle=\"tooltip\" data-placement=\"{{bucheLoginTooltipPlacement}}\" title=\"{{bucheLoginTooltipText}}\"> <a href=\"{{forgotUsernameLink}}\">{{forgotUsernameText}}</a></div><div class=\"form-group\" ng-class=\"{\'has-error\':bucheLoginForm.passwordInput.$error.passwordError}\"><input name=\"passwordInput\" id=\"passwordInput\" type=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"buchePassword\" required=\"\" data-toggle=\"tooltip\" data-placement=\"{{buchePasswordTooltipPlacement}}\" title=\"{{buchePasswordTooltipText}}\"> <a href=\"{{forgotPasswordLink}}\">{{forgotPasswordText}}</a></div><div ng-messages=\"bucheLoginForm.result.$error\"><div ng-message=\"credentials\">Le mot de passe ne correspond pas a l\'identifiant</div></div><button class=\"btn btn-primary\" ng-click=\"bucheLogin()\" ng-disabled=\"bucheLoginForm.$invalid\">Login</button></form></div>");}]);