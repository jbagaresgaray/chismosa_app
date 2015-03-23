'use strict';

var ChatCtrl = function($scope, Chats, $state, $rootScope) {
    console.log("Chat Controller initialized: ");

    $scope.chats = Chats.all();


};

var ChatDetailCtrl = function($scope, Chats, $state, $rootScope, $timeout, $interval, $ionicScrollDelegate) {
    // console.log("ChatDetailCtrl Controller initialized: ", $state.params.id);

    var users = JSON.parse(window.localStorage['users'] || '{}');
    $scope.IM = {
        textMessage: ""
    };


    var messageCheckTimer;

    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    var footerBar; // gets set in $ionicView.enter
    var scroller;
    var txtInput; // ^^^

    $scope.$on('$ionicView.enter', function() {
        console.log('UserMessages $ionicView.enter');

        Chats.selectContact($state.params.id);
        var contactName = Chats.getSelectedContactName();

        if (contactName) {
            $scope.contactName = contactName;
            $scope.chats = Chats.all();
        }

        $timeout(function() {
            footerBar = document.body.querySelector('#userMessagesView .bar-footer');
            scroller = document.body.querySelector('#userMessagesView .scroll-content');
            txtInput = angular.element(footerBar.querySelector('textarea'));
        }, 0);

        messageCheckTimer = $interval(function() {
            // here you could check for new messages if your app doesn't use push notifications or user disabled them
        }, 20000);
    });

    $scope.$on('$ionicView.leave', function() {
        console.log('leaving UserMessages view, destroying interval');
        if (angular.isDefined(messageCheckTimer)) {
            $interval.cancel(messageCheckTimer);
            messageCheckTimer = undefined;
        }
    });

    $scope.$on('$ionicView.beforeLeave', function() {
        if (!$scope.input.message || $scope.input.message === '') {
            localStorage.removeItem('userMessage-' + $scope.toUser._id);
        }
    });

    $scope.sendMessage = function(msg) {
        console.log('msg: ', msg);
        Chats.send(users, msg);
        $scope.IM.textMessage = "";
    }

    $scope.remove = function(chat) {
        Chats.remove(chat);
    }

};

Application.Controllers.controller('ChatCtrl', ['$scope', 'Chats', '$state', '$rootScope', ChatCtrl]);
Application.Controllers.controller('ChatDetailCtrl', ['$scope', 'Chats', '$state', '$rootScope', '$timeout', '$interval', '$ionicScrollDelegate', ChatDetailCtrl]);
