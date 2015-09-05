import { extend } from 'flarum/extend';
import app from 'flarum/app';

import RecaptchaSettingsModal from 'recaptcha/components/RecaptchaSettingsModal';

app.initializers.add('recaptcha', () => {
  app.extensionSettings.recaptcha = () => app.modal.show(new RecaptchaSettingsModal());
});
