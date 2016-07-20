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
  var joinSection = $('#join');
  if (joinSection && joinSection.length) {
    joinSection.load('html/join.part.html', function() {
      var signupForm = $('form.sign-up');
      if (signupForm && signupForm.length) {
        signupForm.validate();
        signupForm.submit(function(event) {
          event.preventDefault();
          if ($(this).valid()) {
            var $form = this;
            var $formValues = {};
            $(this).serializeArray().map(function(x) {
              $formValues[x.name] = x.value;
            });
            $.post('https://neqtr.parseapp.com/join', $formValues)
              .done(function(data) {
                $.growl.notice({
                  title: "Congrats!",
                  message: data.result
                });
                $form.reset();
              }).fail(function(error) {
                $.growl.error({
                  message: error.responseText
                });
              });
          }
        });
      }
    });
  }

  var eventSection = $('#event');
  if (eventSection && eventSection.length) {
    eventSection.load('html/event.part.html', function() {
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
            if (Android) {
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
            $.post('https://neqtr.parseapp.com/suggestEvent', $formValues)
              .done(function(data) {
                var successMessage = data.result;
                $.growl.notice({
                  title: "Thanks!",
                  message: successMessage
                });
                $form.reset();
                postEventMessage('eventSuccess', successMessage);
              }).fail(function(error) {
                var errorMessage = error.responseText;
                $.growl.error({
                  message: errorMessage
                });
                postEventMessage('eventFailure', errorMessage);
              });
          }
        });
      }
    });
  }

  var privacyElement = $('#privacy');
  if (privacyElement && privacyElement.length) {
    privacyElement.load('html/privacy.part.html', function() {
      $('#privacy').toggle();
      $("#privacy-link").click(function() {
        $('#privacy').slideToggle(1000);
      });
    });
  }

  $("body").track({ /* Optional Configuration */ });

  var storeSection = $('#store');
  if (storeSection && storeSection.length) {
    storeSection.scrollwatch({
      delay: 0,
      range: 1.0,
      anchor: 'center',
      init: function(t) {
        $('form.buy-shirt').each(function(i) {
          $(this).css({
            opacity: 0
          });
        });
      },
      on: function(t) {
        $('form.buy-shirt').each(function(i) {
          $(this).delay(i * 500).animate({
            opacity: 1
          }, 1000);
        });
      },
      off: function(t) {
        $('form.buy-shirt').each(function(i) {
          $(this).css({
            opacity: 0
          });
        });
      }
    });
  }

  var productSizeSelectors = $('select.productSize');
  if (productSizeSelectors && productSizeSelectors.length) {
    productSizeSelectors.selectOrDie({
      placeholderOption: true,
      onChange: function() {
        $(this).data('selectedValue', $(this).val());
      }
    });
  }

  if (window.StripeCheckout) {
    var currentDescription = 'Unknown Item';
    var checkout = StripeCheckout.configure({
      key: 'pk_live_ukHMIqvSOCYc18IMkcSrDbik',
      image: 'https://www.neqtr.com/images/logo-padded.png',
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
    var buyShirtForm = $('form.buy-shirt');
    if (buyShirtForm && buyShirtForm.length) {
      buyShirtForm.submit(function(event) {
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
    }
  }
});