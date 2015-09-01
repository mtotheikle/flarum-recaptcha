import { extend } from 'flarum/extend';
import app from 'flarum/app';

import GoogleReCaptchaSettingsModal from 'GoogleReCaptcha/components/GoogleReCaptchaSettingsModal';

app.initializers.add('GoogleReCaptcha', () => {
  app.extensionSettings.GoogleReCaptcha = () => app.modal.show(new GoogleReCaptchaSettingsModal());
});
