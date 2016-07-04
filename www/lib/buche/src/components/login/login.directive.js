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
