'use strict';

var AppCtrl = function($scope, $stateParams, $ionicModal, $ionicLoading, $location, $timeout, $ionicPopup) {

    $scope.searchKey = "";
    var users = JSON.parse(window.localStorage['users'] || '{}');

    $scope.gotoProfile = function() {
        $location.path('/tab/profile');
    }

    $scope.gotoContacts = function() {
        $location.path('/tab/contacts');
    }


    $ionicModal.fromTemplateUrl('templates/search.html', {
        scope: $scope
    }).then(function($ionicModal) {
        $scope.searchmodal = $ionicModal;
    });
    $scope.openSearch = function() {
        console.log('openSearch');
        $scope.searchKey = "";
        $scope.users = {};
        $scope.searchmodal.show();
    };
    $scope.closeSearch = function() {
        console.log('closeSearch');
        $scope.searchmodal.hide();
    };
    $scope.$on('$destroy', function() {
        $scope.searchmodal.remove();
    });

};

Application.Controllers.controller('AppCtrl', ['$scope', '$stateParams', '$ionicModal', '$ionicLoading', '$location', '$timeout', '$ionicPopup', AppCtrl]);


