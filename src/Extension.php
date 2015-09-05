<?php namespace Flarum\Recaptcha;

use Flarum\Support\Extension as BaseExtension;
use Illuminate\Events\Dispatcher;

class Extension extends BaseExtension
{
    public function listen(Dispatcher $events)
    {
        $events->subscribe('Flarum\Recaptcha\Listeners\AddClientAssets');
        $events->subscribe('Flarum\Recaptcha\Listeners\AddApiAttributes');
    }

    public function boot()
    {
        /** @var Dispatcher $dispatcher */
        $dispatcher = $this->app->make('Illuminate\Contracts\Bus\Dispatcher');
        $dispatcher->pipeThrough(['Flarum\Recaptcha\Listeners\ValidateRecaptcha']);
    }
}
