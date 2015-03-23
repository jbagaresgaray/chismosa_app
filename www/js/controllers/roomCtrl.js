'use strict';

var RoomsCtrl = function($scope,Rooms,Chats, $state) {
     //console.log("Rooms Controller initialized");
    $scope.rooms = Rooms.all();
    console.log(' Rooms.all(); ', Rooms.all());

    $scope.openChatRoom = function (roomId) {
        $state.go('tab.chat', {
            roomId: roomId
        });
    }

};

Application.Controllers.controller('RoomsCtrl', ['$scope','Rooms','Chats', '$state', RoomsCtrl]);
