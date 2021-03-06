'use strict';

var LoginCtrl = function($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope, $ionicPlatform) {
    console.log('Login Controller Initialized: ', $rootScope.firebaseUrl);

    $ionicPlatform.ready(function() {
        var ref = new Firebase($rootScope.firebaseUrl);
        var auth = $firebaseAuth(ref);

        $ionicModal.fromTemplateUrl('templates/signup.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.createUser = function(user) {
            console.log("Create User Function called");
            if (user && user.email && user.password && user.displayname) {
                $ionicLoading.show({
                    template: 'Signing Up...'
                });

                auth.$createUser({
                    email: user.email,
                    password: user.password
                }).then(function(userData) {
                    alert("User created successfully!");
                    ref.child("users").child(userData.uid).set({
                        email: user.email,
                        displayName: user.displayname,
                    });

                    $ionicLoading.hide();
                    $scope.modal.hide();
                }).catch(function(error) {
                    alert("Error: " + error);
                    $ionicLoading.hide();
                });
            } else
                alert("Please fill all details");
        }

        $scope.signIn = function(user) {

            if (user && user.email && user.pwdForLogin) {
                $ionicLoading.show({
                    template: 'Signing In...'
                });
                auth.$authWithPassword({
                    email: user.email,
                    password: user.pwdForLogin
                }).then(function(authData) {
                    console.log("Logged in as:" + authData.uid);
                    ref.child("users").child(authData.uid).once('value', function(snapshot) {
                        var val = snapshot.val();
                        // To Update AngularJS $scope either use $apply or $timeout
                        $scope.$apply(function() {
                            $rootScope.displayName = val;
                            window.localStorage['users'] = JSON.stringify(val);
                        });
                    });
                    $ionicLoading.hide();
                    $state.go('tab.home');
                }).catch(function(error) {
                    alert("Authentication failed:" + error.message);
                    $ionicLoading.hide();
                });
            } else
                alert("Please enter email and password both");
        }
    });

};

Application.Controllers.controller('LoginCtrl', ['$scope', '$ionicModal', '$state', '$firebaseAuth', '$ionicLoading', '$rootScope', '$ionicPlatform', LoginCtrl]);
