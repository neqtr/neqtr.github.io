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

$(function() {
  $("body").track({ /* Optional Configuration */ });
  Parse.initialize('6uFTppb9Gpf0tLl1UlqF8wu4BS3FxQCfNXcZbdMe',
    'fVs9IbQfO5LZdKrSsmC4AcNtFVwQrh6M9FCuZZvi');
  $("form").validate();
  $('#privacy').toggle();
  $("#privacy-link").click(function() {
    $('#privacy').slideToggle(1000);
  });
  $('form.sign-up').submit(function(event) {
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
  $('select.productSize').selectOrDie({
    placeholderOption: true,
    onChange: function() {
      $(this).data('selectedValue', $(this).val());
    }
  });
  var currentDescription = 'Unknown Item';
  var checkout = StripeCheckout.configure({
    key: 'pk_live_ukHMIqvSOCYc18IMkcSrDbik',
    image: 'images/logo-padded.png',
    token: function(token) {
      $.post('https://neqtr-store.parseapp.com/orders', {
        tokenId: token.id,
        description: currentDescription,
        email: token.email
      }).done(function(data) {
        console.log(data);
        $.growl.notice({
          title: data.result,
          message: data.detail
        });
      })
      .fail(function(data) {
        $.growl.error({
          message: data.responseText
        });
      })
    }
  });
  $('form.buy-shirt').submit(function(event) {
    event.preventDefault();
    var selectedSize = $(this).find('select.productSize').data('selectedValue');
    var description = selectedSize + ' ' + $(this).find('h5:first').text() + ' ($15.00)';
    currentDescription = description;
    if (selectedSize) {
      checkout.open({
        name: 'Neqtr',
        description: description,
        amount: 1500,
        billingAddress: true
      });
    } else {
      $.growl.error({
        message: 'Please select a size!'
      });
    }
  });
});