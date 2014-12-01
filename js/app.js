var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-55492630-1']);
_gaq.push(['_trackPageview']);
(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();

$(function() {
  $("body").track({ /* Optional Configuration */ });
  Parse.initialize('6uFTppb9Gpf0tLl1UlqF8wu4BS3FxQCfNXcZbdMe',
    'fVs9IbQfO5LZdKrSsmC4AcNtFVwQrh6M9FCuZZvi');
  $("form").validate();
  $('form').submit(function(event) {
    event.preventDefault();
    if (this.valid()) {
      var LaunchSubscriber = Parse.Object.extend("LaunchSubscriber");
      var $form = {};
      $(this).serializeArray().map(function(x) {
        $form[x.name] = x.value;
      });
      new LaunchSubscriber().save($form, {
        success: function(object) {
          $.growl.notice({
            title: "Congrats!",
            message: 'See ya when the app launches!'
          });
        },
        error: function(model, error) {
          $.growl.error({
            message: 'Unable to sign you up to get notified!'
          });
        }
      });
    }
  });
});