'use strict';

var ForgotCtrl = function ($scope, $state, $location, $ionicSlideBoxDelegate) {
  // Called to navigate to the main app
  console.log('ForgotCtrl');
  $scope.doSignUp = function () {
    $location.path('/signup');
  }
  $scope.doLogin = function () {
    $location.path('/login');
  }
};

Application.Controllers.controller('ForgotCtrl', ['$scope', '$state', '$ionicSlideBoxDelegate', ForgotCtrl]);
