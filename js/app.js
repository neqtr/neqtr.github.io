(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-55492630-2', 'auto');
ga('send', 'pageview');

$(function() {
  $("body").track({ /* Optional Configuration */ });
  Parse.initialize('6uFTppb9Gpf0tLl1UlqF8wu4BS3FxQCfNXcZbdMe',
    'fVs9IbQfO5LZdKrSsmC4AcNtFVwQrh6M9FCuZZvi');
  $("form").validate();
  $(".content").fitVids();
  $('#privacy').toggle();
  $("#privacy-link").click(function() {
    $('#privacy').slideToggle(1000);
  });
  $('form').submit(function(event) {
    event.preventDefault();
    if ($(this).valid()) {
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