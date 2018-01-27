import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import saveConfig from 'flarum/utils/saveConfig';

export default class RecaptchaSettingsModal extends Modal {
  constructor(...args) {
    super(...args);

    this.siteKey = m.prop(app.config['recaptcha.site_key'] || '');
    this.secretKey = m.prop(app.config['recaptcha.secret_key'] || '');
  }

  className() {
    return 'RecaptchaSettingsModal Modal--small';
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
              className: 'Button Button--primary RecaptchaSettingsModal-save',
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
      'recaptcha.site_key': this.siteKey(),
      'recaptcha.secret_key': this.secretKey()
    }).then(
      () => this.hide(),
      () => {
        this.loading = false;
        m.redraw();
      }
    );
  }
}
