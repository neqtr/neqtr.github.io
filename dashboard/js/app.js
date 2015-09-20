(function(d, s, id){
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) {return;}
js = d.createElement(s); js.id = id;
js.src = "//connect.facebook.net/en_US/sdk.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

window.getAuthType = function() {
  return 'facebook';
}

Parse.initialize('QLpuWDRSTQQj6KcfrUOoYPUgEFpC057YlvTNb1Vf', 'UwUUDzfZ6k9hcHc3wBjiM2PUJuxmHPnomdB0FOvr');
window.fbAsyncInit = function() {
  Parse.FacebookUtils.init({ // this line replaces FB.init({
    appId      : '874529702559292', // Facebook App ID
    status     : false,  // check Facebook Login status
    cookie     : true,  // enable cookies to allow Parse to access the session
    xfbml      : true,  // initialize Facebook social plugins on the page
    version    : 'v2.3' // point to the latest Facebook Graph API version
  });
  // Run code after the Facebook SDK is loaded.
};

function updateWeeklyTotals() {
  
}

function updateCharts() {
  Morris.Donut({
    element: 'morris-gender-chart',
    data: [{
      label: "Male",
      value: 150
    }, {
      label: "Female",
      value: 200
    }, {
      label: "Other",
      value: 10
    }],
    resize: true
  });

  Morris.Donut({
    element: 'morris-platform-chart',
    data: [{
      label: "iOS",
      value: 200
    }, {
      label: "Android",
      value: 136
    }],
    resize: true
  });

  Morris.Donut({
    element: 'morris-looking-for-chart',
    data: [{
      label: "Friends",
      value: 78
    }, {
      label: "Love",
      value: 30
    }, {
      label: "Both",
      value: 121
    }],
    resize: true
  });
}

function updateForLogin(user) {
  $('form.login').addClass('hidden');
  $('form.logout').removeClass('hidden');
  var loggedIn = $('.logged-in-text');
  loggedIn.text('Hello ' + user.get('firstName'));
  loggedIn.removeClass('hidden');
  console.log(user);
  var loggedInContent = $('.logged-in-content');
  loggedInContent.addClass('hidden');
  $('.logged-out-content').addClass('hidden');
  loggedInContent.load('html/widgets.part.html', function() {
    loggedInContent.removeClass('hidden');
    loggedInContent.fadeIn();
    updateWeeklyTotals();
    updateCharts();
  });
}

function updateForLogout() {
  $('form.login').removeClass('hidden');
  $('form.logout').addClass('hidden');
  var loggedIn = $('.logged-in-text');
  loggedIn.text('');
  loggedIn.addClass('hidden');

  $('.logged-in-content').addClass('hidden');
  $('.logged-out-content').removeClass('hidden');
}

$(function() {
  $('form.login').submit(function(event) {
    event.preventDefault();
    Parse.FacebookUtils.logIn(null, {
      success: function(user) {
        if (user.get('email')) {
            updateForLogin(user);
        } else {
            alert("User not registered");
        }
      },
      error: function(user, error) {
        alert("User cancelled the Facebook login or did not fully authorize.");
      }
    });
  });

  $('form.logout').submit(function(event) {
    event.preventDefault();
    Parse.User.logOut();
    updateForLogout();
  });

  // var currentUser = Parse.User.current();
  // if (currentUser && currentUser.get('email')) {
  //   updateForLogin(currentUser);
  // } else {
  //   updateForLogout();
  // }
  updateForLogin({
    get: function() {
      return 'User';
    }
  });
});