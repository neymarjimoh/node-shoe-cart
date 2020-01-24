var stripe = Stripe('pk_test_bC4JUE9h5kAzbN6WXalDWvgY00P9vrAwzG');
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
var style = {
    base: {
    // Add your base input styles here. For example:
      iconColor: '#c4f0ff',
      color: '#fff',
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: '#fce883',
      },
      '::placeholder': {
        color: '#87BBFD',
      },
    //   color: '#32325d',
    },
    invalid: {
        iconColor: '#FFC7EE',
        color: '#FFC7EE',
    },

};
  
// Create an instance of the card Element.
// var card = elements.create('card', {style: style});
var cardElement = elements.create('card');

cardElement.mount('#card-element');

var cardElement = elements.getElement('card');

// var cardNumberElement = elements.create('cardNumber', {style: style});

// var cardExpiryElement = elements.create('cardExpiry', {style: style});

// var cardCvcElement = elements.create('cardCvc');
  
// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Create a token or display an error when the form is submitted.
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the customer that there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      stripeTokenHandler(result.token);
    }
  });
});

function stripeTokenHandler(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById('payment-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);
  
    // Submit the form
    form.submit();
}






// var stripe = Stripe('pk_test_bC4JUE9h5kAzbN6WXalDWvgY00P9vrAwzG');

// var $form = $('#checkout-form');

// $form.submit(function (e) { 
//     e.preventDefault();
//     $form.find('button').prop('disabled', true)
//     // var elements = stripe.elements();
//     // var cardElement = elements.create('card');
//     stripe.card.createToken({
//         number: $('#card-number').val(),
//         cvc: $('#card-cvc').val(),
//         exp_month: $('card-expiry-month').val(),
//         exp_year: $('#card-expiry-year').val(),
//         name: $('#card-name').val()

//     }, stripeResponseHandler)
//     return false
// });
