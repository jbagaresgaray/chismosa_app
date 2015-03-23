'use strict';

(function() {

    var Auth = function($firebaseAuth, $rootScope) {
        var ref = new Firebase(firebaseUrl);
        return $firebaseAuth(ref);
    };

    Application.Services.factory('Auth', ['$firebaseAuth', '$rootScope', Auth]);

}());
