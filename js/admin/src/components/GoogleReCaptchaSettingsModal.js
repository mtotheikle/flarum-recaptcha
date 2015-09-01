import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import saveConfig from 'flarum/utils/saveConfig';

export default class GoogleReCaptchaSettingsModal extends Modal {
  constructor(...args) {
    super(...args);

    debugger;
    this.siteKey = m.prop(app.config['google_recaptcha.site_key'] || '');
    this.secretKey = m.prop(app.config['google_recaptcha.secret_key'] || '');
  }

  className() {
    return 'GoogleReCaptchaSettingsModal Modal--small';
  }

  title() {
    return 'Google reCAPTCHA Settings';
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group">
            <label>Site Key</label>
            <input className="FormControl" value={this.siteKey()} oninput={m.withAttr('value', this.siteKey)}/>
          </div>

          <div className="Form-group">
            <label>Secret Key</label>
            <input className="FormControl" value={this.secretKey()} oninput={m.withAttr('value', this.secretKey)}/>
          </div>

          <div className="Form-group">
            {Button.component({
              type: 'submit',
              className: 'Button Button--primary GoogleReCaptchaSettingsModal-save',
              loading: this.loading,
              children: 'Save Changes'
            })}
          </div>
        </div>
      </div>
    );
  }

  onsubmit(e) {
    e.preventDefault();

    this.loading = true;

    saveConfig({
      'google_recaptcha.site_key': this.siteKey(),
      'google_recaptcha.secret_key': this.secretKey()
    }).then(
      () => this.hide(),
      () => {
        this.loading = false;
        m.redraw();
      }
    );
  }
}
