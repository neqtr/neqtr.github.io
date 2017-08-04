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

// Parse.initialize('kcGGwHOjKTWdTUJRjaPm0PF43FWkwJ4bBBsO2ffr');
// Parse.serverURL = 'https://sandbox.neqtr.com/1';
Parse.initialize('FZA2Az7SgY0jnqTnLIl5JW1W7C5OSp3HUrqog4uI');
Parse.serverURL = 'https://prod.neqtr.com/1';
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

function addWeeklyTotal(weeklyTotal) {
  var template = $('#weekly-total-template').clone();
  template.removeAttr('id');
  template.find('.panel-container').addClass('panel-' + weeklyTotal.type);
  template.find('.icon').addClass('fa-' + weeklyTotal.icon);
  template.find('.total').text(weeklyTotal.total);
  template.find('.total-label').text(weeklyTotal.label);
  template.hide().fadeIn();
  template.appendTo('.row.weekly');
}

function updateWeeklyRange() {
  var today = moment(),
  weekAgo = moment().subtract({ days: 7 }),
  displayToday = today.format('MMM Do'),
  displayWeekAgo = weekAgo.format('MMM Do'),
  displayRange = displayWeekAgo + ' - ' + displayToday;
  $('.weekly-range').text(displayRange);
}

function updateWeeklyTotals() {
  Parse.Cloud.run('weeklyTotal', {
    totalClass: '_Installation'
  }).then(function(total) {
    addWeeklyTotal({
      type: 'warning',
      icon: 'mobile',
      total: total,
      label: 'Installs'
    });
    return Parse.Cloud.run('weeklyTotal', {
      totalClass: '_User'
    });
  }).then(function(total) {
    addWeeklyTotal({
      type: 'info',
      icon: 'user',
      total: total,
      label: 'Profiles'
    });
    return Parse.Cloud.run('weeklyTotal', {
      totalClass: 'Answer',
      hasText: true
    });
  }).then(function(total) {
    addWeeklyTotal({
      type: 'warning',
      icon: 'question',
      total: total,
      label: 'Questions Answered'
    });
    return Parse.Cloud.run('weeklyTotal', {
      totalClass: 'Photo'
    });
  }).then(function(total) {
    addWeeklyTotal({
      type: 'info',
      icon: 'photo',
      total: total,
      label: 'Photos'
    });
    return Parse.Cloud.run('weeklyTotal', {
      totalClass: 'Match',
      liked: true
    });
  }).then(function(total) {
    addWeeklyTotal({
      type: 'danger',
      icon: 'heart',
      total: total,
      label: 'Matches'
    });
    return Parse.Cloud.run('weeklyTotal', {
      totalClass: 'Message'
    });
  }).then(function(total) {
    addWeeklyTotal({
      type: 'info',
      icon: 'comments',
      total: total,
      label: 'Chat Messages'
    });
    return Parse.Cloud.run('weeklyTotal', {
      totalClass: 'Rsvp'
    });
  }).then(function(total) {
    addWeeklyTotal({
      type: 'success',
      icon: 'calendar-check-o',
      total: total,
      label: 'Social RSVPs'
    });
    return Parse.Cloud.run('weeklyTotal', {
      totalClass: 'SexyPointAction'
    });
  }).then(function(total) {
    addWeeklyTotal({
      type: 'success',
      icon: 'trophy',
      total: total,
      label: 'Sexy Points'
    });
  }, function(error) {
    console.error(error);
  });
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
    loggedInContent.hide();
    loggedInContent.fadeIn();
    updateWeeklyRange();
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

  var currentUser = Parse.User.current();
  if (currentUser && currentUser.get('email')) {
    updateForLogin(currentUser);
  } else {
    updateForLogout();
  }
});