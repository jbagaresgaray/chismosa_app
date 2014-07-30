'use strict';

var IntroCtrl = function ($scope, $state, $ionicSlideBoxDelegate) {
  // Called to navigate to the main app
  $scope.startApp = function () {
    $state.go('login');
  };
  $scope.next = function () {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function () {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function (index) {
    $scope.slideIndex = index;
  };
};

Application.Controllers.controller('IntroCtrl', ['$scope', '$state', '$ionicSlideBoxDelegate', IntroCtrl]);
