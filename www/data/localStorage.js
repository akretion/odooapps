angular.module('starter')
.factory('localStorage', ['$window','$q', function($window, $q) {
    return {
        set: function(key, value) {
            return $q(function (resolve, reject) {
                resolve($window.localStorage[key] = JSON.stringify(value));
            });
        },
        get: function(key) {
            return $q(function (resolve, reject) {
                var val = $window.localStorage[key];
                if (val)
                    resolve(JSON.parse(val));
                else
                    reject('key not found');
            });
        },
    remove: function(key) {
      return $q(function (resolve) {
        resolve($window.localStorage.removeItem(key));
      });
    }
    }
}]);
