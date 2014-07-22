'use strict';

var ContactsCtrl = function ($scope, $ionicModal, $ionicPopup, $location, $ionicLoading, ContactsFactory) {
  console.log('ContactsCtrl');

  var users = JSON.parse(window.localStorage['users'] || '{}');

  $ionicModal.fromTemplateUrl('templates/friendProfile.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.profileModal = $ionicModal;
  });
  $scope.openProfile = function(id) {
    console.log('openProfile');
    getContactDetails(users.id, id);
    $scope.profileModal.show();
  };
  $scope.closeprofile = function () {
    console.log('closeprofile');
    $scope.profileModal.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.profileModal.remove();
  });


  $ionicModal.fromTemplateUrl('templates/messageDetail.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.messagedetail = $ionicModal;
  });
  $scope.composeMessage = function (id) {
    $scope.contact_id = id;
    getContactDetails(users.id, id);
    $scope.messagedetail.show();
  };
  $scope.closeMessageDetail = function () {
    console.log('closeMessageDetail');
    $scope.messagedetail.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.messagedetail.remove();
  });

  $ionicModal.fromTemplateUrl('templates/createcontacts.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.createModal = $ionicModal;
  });
  $scope.openCreateContact = function () {
    console.log('openCreateContact');

    $scope.state = 'create';
    $scope.newcontact = {};

    $scope.createModal.show();
  };
  $scope.modifyContact = function () {
    console.log('modifyContact');
    $scope.createModal.show();
  };
  $scope.closeCreateContact = function () {
    console.log('closeCreateContact');

    getContacts();

    $scope.createModal.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.createModal.remove();
  });


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

  $scope.saveContacts = function () {
    $scope.newcontact.user_id = users.id;
    ContactsFactory.checkExisting($scope.newcontact.mobile_number)
      .success(function (data) {
        console.log(data);
        if (data[0].success == true) {
          $ionicPopup.alert({
            title: 'Error',
            template: 'Contact Information already existed!'
          });
        } else {
          ContactsFactory.create($scope.newcontact)
            .success(function (res) {
              console.log(res);
              if (res[0].success == true) {

                $ionicPopup.alert({
                  title: 'Record save',
                  template: res[0].message
                });

                $scope.closeCreateContact();

              } else {
                $ionicPopup.alert({
                  title: 'Error',
                  template: res[0].message
                });
              }
            })
            .error(function (error) {
              $ionicPopup.alert({
                title: 'Error',
                template: error[0].message
              });
              return;
            });
        }
      })
      .error(function (error) {
        $ionicPopup.alert({
          title: 'Error',
          template: 'An error occur while checking the mobile number'
        });
        return;
      });
  };

  $scope.updateContacts = function () {
    console.log('updateContacts');

    $scope.newcontact.user_id = users.id;

    ContactsFactory.create($scope.newcontact)
      .success(function (res) {
        console.log(res);
        if (res[0].success == true) {
          $ionicPopup.alert({
            title: 'Record save',
            template: res[0].message
          });
          $location.path('/app/contact');
          console.log('$location.path(app/contact);');
        } else {
          $ionicPopup.alert({
            title: 'Error',
            template: res[0].message
          });
        }
      })
      .error(function (error) {
        $ionicPopup.alert({
          title: 'Error',
          template: error[0].message
        });
        return;
      });
  };


  $scope.showConfirm = function(id) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Consume Ice Cream',
     template: 'Are you sure you want to eat this ice cream?'
   });
   confirmPopup.then(function(res) {
     if(res) {
        console.log('You are sure');

        $ionicLoading.show({
          template: 'Deleting...'
        });
        console.log(users.id + ';' + id);

        ContactsFactory.deleteContacts(users.id,id)
          .success(function (res) {
            console.log(res);
            if (res[0].success == true) {
              $ionicLoading.hide();
              $ionicPopup.alert({
                title: 'Delete',
                template: res[0].message
              });
              $scope.closeprofile();
              getContacts();
            } else {
              $ionicLoading.hide();
              $ionicPopup.alert({
                title: 'Error',
                template: res[0].message
              });
            }
          })
          .error(function (error) {
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: 'Error',
              template: error[0].message
            });
            return;
          });
      }
   });
 };


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

  function getContactDetails(user_id, id) {
    $ionicLoading.show({
      template: 'Loading...'
    });
    console.log(user_id);
    console.log(id);
    $scope.newcontact = {};
    ContactsFactory.showdetail(user_id, id)
      .success(function (data) {
        console.log(data);

        $scope.profiledetail = data[0];

        $scope.contact_id = data[0].id;

        $scope.newcontact.name = data[0].contact_name;
        $scope.newcontact.areacode = data[0].contact_areacode;
        $scope.newcontact.mobile_number = data[0].contact_number;
        $scope.newcontact.email = data[0].contact_email;

        $scope.state = 'update';

        $ionicLoading.hide();
      })
      .error(function (error) {
        $ionicLoading.hide();
        console.log(error);
        $scope.status = 'Unable to load customer data: ' + error.message;
      });
  }


  var messageOptions = [{
    message: '<p>Wow, this is really something huh? <br>1:50 PM</p>'
    }, {
    message: '<p>Yea, it\'s pretty sweet <br>1:50 PM</p>'
    }, {
    message: '<p>I think I like Ionic more than I like ice cream! <br>1:50 PM</p>'
    }, {
    message: '<p>Gee wiz, this is something special. <br>1:50 PM</p>'
    }, {
    message: '<p>Am I dreaming? <br>1:50 PM</p>'
    }, {
    message: '<p>Yea, it\'s pretty sweet <br>1:50 PM</p>'
    }, {
    message: '<p>I think I like Ionic more than I like ice cream! <br>1:50 PM</p>'
    }, {
    message: '<p>Is this magic? <br>1:50 PM</p>'
    }, {
    message: '<p>Am I dreaming? <br>1:50 PM</p>'
    }];
  var messageIter = 0;
  $scope.messagesdetails = messageOptions.slice(0, messageOptions.length);

  getContacts();

};


Application.Controllers.controller('ContactsCtrl', ['$scope','$ionicModal', '$ionicPopup', '$location', '$ionicLoading', 'ContactsFactory', ContactsCtrl]);
