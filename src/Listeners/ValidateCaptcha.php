<?php namespace FlarumExtensions\Listeners;

use Flarum\Core\Users\Commands\RegisterUser;
use Flarum\Events\ModelValidator;
use Flarum\Events\UserWillBeSaved;
use Illuminate\Contracts\Events\Dispatcher;
use ReCaptcha\ReCaptcha;

class ValidateCaptcha
{
    private $registeringUser;
    private $captchaResponse;

    public function handle($command, $next)
    {
        if ($command instanceof RegisterUser) {
            $dispatcher = app(Dispatcher::class);
            $dispatcher->listen(UserWillBeSaved::class, [$this, 'userSaving']);
            $dispatcher->listen(ModelValidator::class, [$this, 'attachCaptchaRule']);

            $this->captchaResponse = array_get($command->data, 'attributes.g-recaptcha-response');
        }

        return $next($command);
    }

    public function userSaving(UserWillBeSaved $user)
    {
        $this->registeringUser = $user->user;
    }

    public function attachCaptchaRule(ModelValidator $validator)
    {
        // ensure that when we get a validator instance, the model that we are validating is indeed the user that is
        // registering
        if (false == ($validator->model === $this->registeringUser)) {
            return;
        }

        $validator->validator->addExtension('recaptcha', function($attribute, $value, $parameters) {

            $recaptcha = new ReCaptcha("TODO");
            $resp = $recaptcha->verify($this->captchaResponse);
            if ($resp->isSuccess()) {
                // verified!
                return true;
            } else {
                $errors = $resp->getErrorCodes();
            }

            return $errors;
        });

        $rules = $validator->validator->getRules();
        $data = $validator->validator->getData();

        $data['recaptcha_response'] = $this->captchaResponse;
        $rules['recaptcha_response'] = 'required|recaptcha';

        $validator->validator->setData($data);
        $validator->validator->setRules($rules);
    }
}
