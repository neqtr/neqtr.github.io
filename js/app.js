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
  $("form").validate();
  $('#privacy').toggle();
  $("#privacy-link").click(function() {
    $('#privacy').slideToggle(1000);
  });
  $('form.sign-up').submit(function(event) {
    event.preventDefault();
    if ($(this).valid()) {
      var $form = this;
      var $formValues = {};
      $(this).serializeArray().map(function(x) {
        $formValues[x.name] = x.value;
      });
      $.post('http://neqtrtest.parseapp.com/join', $formValues)
      .done(function(data) {
        $.growl.notice({
          title: "Congrats!",
          message: data.result
        });
        //$form.reset();
      }).fail(function(error) {
        $.growl.error({
          message: error.responseText
        });
      });
    }
  });
  $('#store').scrollwatch({
    delay:    0,
    range:    1.0,
    anchor:   'center',
    init:   function(t) {
      $('form.buy-shirt').each(function(i) {
        $(this).css({opacity: 0});
      });
    },
    on:     function(t) {
      $('form.buy-shirt').each(function(i) {
        $(this).delay(i * 500).animate({opacity: 1}, 1000);
      });
    },
    off:    function(t) {
      $('form.buy-shirt').each(function(i) {
        $(this).css({opacity: 0});
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