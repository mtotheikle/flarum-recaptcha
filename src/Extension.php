<?php namespace FlarumExtensions;

use Flarum\Support\Extension as BaseExtension;
use Illuminate\Events\Dispatcher;

class Extension extends BaseExtension
{
    public function listen(Dispatcher $events)
    {
        $events->subscribe('FlarumExtensions\Listeners\AddClientAssets');
        $events->subscribe('FlarumExtensions\Listeners\AddApiAttributes');
    }

    public function boot()
    {
        /** @var Dispatcher $dispatcher */
        $dispatcher = $this->app->make('Illuminate\Contracts\Bus\Dispatcher');
        $dispatcher->pipeThrough(['FlarumExtensions\Listeners\ValidateCaptcha']);
    }
}
