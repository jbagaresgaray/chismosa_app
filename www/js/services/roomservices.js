'use strict';

(function() {

    var Rooms = function($firebase, $firebaseArray, $firebaseObject) {
        var ref = new Firebase(firebaseUrl);
        var rooms = $firebaseObject(ref.child('rooms'));

        return {
            all: function() {
                return rooms;
            },
            get: function(contactId) {
                return rooms.$getRecord(roomId);
            }
        }
    };

    Application.Services.factory('Rooms', ['$firebase', '$firebaseArray', '$firebaseObject', Rooms]);

}());
