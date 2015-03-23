'use strict';

var ContactsCtrl = function($scope, Contacts, Users, Chats, $state, $ionicModal, $ionicScrollDelegate, $timeout, $interval) {
    console.log("Contacts Controller initialized");

    var messageCheckTimer;
    var users = JSON.parse(window.localStorage['users'] || '{}');

    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    var footerBar; // gets set in $ionicView.enter
    var scroller;
    var txtInput; // ^^^

    init();

    $scope.$on('$destroy', function() {
        $scope.modal.remove();

        if (angular.isDefined(messageCheckTimer)) {
            $interval.cancel(messageCheckTimer);
            messageCheckTimer = undefined;
        }
    });

    $ionicModal.fromTemplateUrl('templates/createcontacts.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/tab-chat.html', {
        scope: $scope
    }).then(function($ionicModal) {
        $scope.messagedetail = $ionicModal;
    });

    $scope.composeMessage = function(id) {
        Chats.selectContact(id);
        var contactName = Chats.getSelectedContactName();

        if (contactName) {
            $scope.contact = id;
            $scope.contactName = contactName;
            $scope.chats = Chats.all();
        }

        $timeout(function() {
            footerBar = document.body.querySelector('#userMessagesView .bar-footer');
            scroller = document.body.querySelector('#userMessagesView .scroll-content');
            txtInput = angular.element(footerBar.querySelector('textarea'));
        }, 0);

        messageCheckTimer = $interval(function() {}, 20000);

        $scope.messagedetail.show();
    };

    $scope.sendMessage = function(msg) {
        console.log('msg: ', msg);
        Chats.send(users, msg);
        $scope.IM.textMessage = "";
    }

    $scope.remove = function(chat) {
        Chats.remove(chat);
    }

    $scope.doRefreshMessage = function(id) {
        $scope.chats = Chats.all();
        console.log('chats: ',$scope.chats);
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.doRefresh = function() {
        $scope.contacts = Contacts.all();
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.saveContacts = function(user) {

    }


    $scope.openChatRoom = function(roomId) {
        $state.go('tab.chat', {
            roomId: roomId
        });
    }



    function init() {
        $scope.IM = {
            textMessage: ""
        };
        $scope.contacts = Contacts.all();
    }

};

Application.Controllers.controller('ContactsCtrl', ['$scope', 'Contacts', 'Users', 'Chats', '$state', '$ionicModal', '$ionicScrollDelegate', '$timeout', '$interval', ContactsCtrl]);
