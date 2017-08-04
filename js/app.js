var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-55492630-2']);
_gaq.push(['_trackPageview']);
(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();

Parse.initialize('FZA2Az7SgY0jnqTnLIl5JW1W7C5OSp3HUrqog4uI');
Parse.serverURL = 'https://prod.neqtr.com/1';

$(function() {
  var eventSection = $('#event');
  if (eventSection && eventSection.length) {
    eventSection.load('/html/event.part.html', function() {
      var eventForm = $('form.suggest-event');
      if (eventForm && eventForm.length) {
        eventForm.validate();

        $('.date-time-picker').datetimepicker({
          format: 'm/d/Y h:i A',
          formatTime: 'g:i A'
        });

        $(".date-time-picker[name='start']").blur(function() {
          $(".date-time-picker[name='end']").filter(function() {
            return !this.value;
          }).val($(this).val());
        });

        eventForm.submit(function(event) {
          event.preventDefault();
          var $form = this;

          function postEventMessage(name, message) {
            if (window.webkit && webkit.messageHandlers && webkit.messageHandlers[name]) {
              webkit.messageHandlers[name].postMessage(message);
            }
            if (window.Android) {
            	Android.postMessage(name, message);
            }
          }
          if (!$(this).valid()) {
            postEventMessage('eventInvalid');
          } else {
            var $formValues = {};
            $(this).serializeArray().map(function(x) {
              $formValues[x.name] = x.value;
            });
            $formValues.userId = url('?userId');
            Parse.Cloud.run('suggestEvent', $formValues)
            .then(function(successMessage) {
              $.growl.notice({
                title: "Thanks!",
                message: successMessage
              });
              $form.reset();
              postEventMessage('eventSuccess', successMessage);
            }, function(error) {
              var errorMessage = error.message || error;
              $.growl.error({
                message: errorMessage
              });
              postEventMessage('eventFailure', errorMessage)
            });
          }
        });
      }
    });
  }

  var privacyElement = $('#privacy');
  if (privacyElement && privacyElement.length) {
    privacyElement.load('/html/privacy.part.html', function() {
      $('#privacy').toggle();
      $("#privacy-link").click(function() {
        $('#privacy').slideToggle(1000);
      });
    });
  }

  $("body").track({ /* Optional Configuration */ });
});