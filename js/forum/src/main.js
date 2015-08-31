import { extend, override } from 'flarum/extend';
import app from 'flarum/app';

import SignUpModal from 'flarum/components/SignUpModal';
import ModalManager from 'flarum/components/ModalManager';
import LoadingIndicator from 'flarum/components/LoadingIndicator';

app.initializers.add('GoogleReCaptcha', () => {

  let scriptLoaded = false;
  let widgetId = -1;

  const renderCaptcha = function() {
    if (false == scriptLoaded) return;

    if (this.$('#Recaptcha').children().length) return;

    //app.forum.attribute('apiUrl')
    widgetId = grecaptcha.render('Recaptcha', {
      'sitekey': 'XXX'
    });
  }

  // register global callback for when recaptcha is loaded and available
  window.onloadCallback = function() {
    scriptLoaded = true;

    m.redraw();
  };

  extend(SignUpModal.prototype, 'config', function(x, isInitialized, context) {
    // config is called on component redraw while onready is only called only when the modal is shown
    // if we are showing and the script is loaded, then we can safely render captcha
    // this handles multiple cases:
    //  - user clicking the sign-up button while the script is loading
    //  - clicking sign-up, then closing the modal and re-opening it
    renderCaptcha.apply(this);

    if (isInitialized) return;

    $.getScript('//www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit', () => { })
  })

  extend(SignUpModal.prototype, 'onready', function() {
    renderCaptcha.apply(this);
  })

  ///

  extend(SignUpModal.prototype, 'submitData', function(data) {
    data['g-recaptcha-response'] = this.$('[name=g-recaptcha-response]').val()
  })

  override(SignUpModal.prototype, 'body', function(original) {
    // TODO If loading captcha files fails then we should show error after x time

    // must wait until we have captcha loaded
    if (false == scriptLoaded) return LoadingIndicator.component({className: 'LoadingIndicator--block'});

    let vdom = original();

    if (this.welcomeUser) return vdom;

    const formChildren = vdom[0].children;
    const captchaHolder = [(
      <div id="Recaptcha"></div>
    )];

    // insert reCAPTCHA div after password field
    // TODO: Not very friendly
    formChildren.splice.apply(formChildren, [3, 0].concat(captchaHolder));

    return vdom
  })
});
