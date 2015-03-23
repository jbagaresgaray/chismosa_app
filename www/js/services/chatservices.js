'use strict';

'use strict';

(function() {

    var Chats = function($firebase, $firebaseArray, Contacts) {
        var selectedContactId;

        var ref = new Firebase(firebaseUrl);
        var chats;

        return {
            all: function() {
                return chats;
            },
            remove: function(chat) {
                chats.$remove(chat).then(function(ref) {
                    ref.key() === chat.$id; // true item has been removed
                });
            },
            get: function(chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            },
            getSelectedContactName: function() {
                var selectedContact;
                console.log('selectedContactId:', selectedContactId);
                // if (selectedContactId && selectedContactId != null) {
                if (selectedContactId != null) {
                    console.log('pumasok na dito');
                    selectedContact = Contacts.get(selectedContactId);
                    console.log('selectedContact:', selectedContact);
                    if (selectedContact)
                        return selectedContact.name;
                    else
                        return null;
                } else {
                    console.log('pumasok na dito else');
                    return null;
                }
            },
            selectContact: function(Id) {
                console.log("selecting the contact with id: " + Id);
                selectedContactId = Id;
                if (!isNaN(Id)) {
                    console.log('asdasdasd');
                    chats = $firebaseArray(ref.child('contacts').child(selectedContactId).child('chats'));
                    console.log('chats:', chats);
                }
            },
            send: function(from, message) {
                console.log("sending message from :" + from.displayName + " & message is " + message);
                if (from && message) {
                    var chatMessage = {
                        from: from.displayName,
                        message: message,
                        createdAt: Firebase.ServerValue.TIMESTAMP
                    };
                    console.log(chatMessage);
                    chats.$add(chatMessage).then(function(data) {
                        console.log("message added");
                    });
                }
            }
        }
    };

    Application.Services.factory('Chats', ['$firebase', '$firebaseArray', 'Contacts', Chats]);

}());
