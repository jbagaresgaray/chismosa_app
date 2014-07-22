'use strict';

var ctrl = angular.module('todo.controllers', []);

ctrl.controller('AppCtrl', function ($scope, $stateParams, $ionicModal, $ionicLoading, $location,ContactsFactory,ChatsFactory) {
  console.log('AppCtrl');

  var users = JSON.parse(window.localStorage['users'] || '{}');

  $ionicModal.fromTemplateUrl('templates/search.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.searchmodal = $ionicModal;
  });
  $scope.openSearch = function () {
    console.log('openSearch');
    getContacts();
    $scope.searchmodal.show();
  };
  $scope.closeSearch = function () {
    console.log('closeCompose');
    $scope.searchmodal.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.searchmodal.remove();
  });

  $scope.logoutApp = function () {
    window.localStorage.removeItem("users");
    $location.path('/login');
  }

  function getContacts() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    ContactsFactory.query(users.id)
      .success(function (data) {
        $scope.contacts = data;
        window.localStorage['contacts'] = JSON.stringify(data);
        $ionicLoading.hide();
      })
      .error(function (error) {
        $ionicLoading.hide();
        console.log(error);
        $scope.status = 'Unable to load customer data: ' + error.message;
      });
  }

  function getUserProfile() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    $scope.profile = users;
    if (users.pic_blob) {
      $scope.profilePic = "data:image/png;base64," + (users.pic_blob);
    } else {
      $scope.profilePic = "img/photo.png";
    }

    $ionicLoading.hide();
  }



  getUserProfile();


});


