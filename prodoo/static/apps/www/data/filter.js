'use strict';

angular.module('starter').filter('blFilter', [function () {
    return function (items, orderFilterTxt) {
        if (!orderFilterTxt)
            return items;

        var orderFilterTxtUpper = orderFilterTxt.toUpperCase();
        return items.filter(function (i) {
            
            return ['name', 'ean13', 'customer'].some(function (field) {
                if (!i[field])
                    return false;

                return i[field].toUpperCase().indexOf(orderFilterTxtUpper) !== -1;
            });
 
        });
    };
}])