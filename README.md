# flok - Radical Open Business Operation Toolkit
## brought to you by Nothing Interactive

## Why 'flok'?

The project's name 'flok' has its roots in the terms 'flock' or 'flocking', the collective motion of a large number of self-propelled entities. The project wants to respect our collective, emergent behaviour arising from simple rules that are followed by individuals and doesn't involve any central coordination. This is the reason why we chose flok.to as domain to underline the conceptional idea even in the URL, e.g. 'flok.to/time'.

flok can be best understood as a toolkit for companies with agile project processes and Open Business workflows and therefore will grow with the needs arising while always sticking to the idea of the [Minimum Viable Product (MVP)](https://en.wikipedia.org/wiki/Minimum_viable_product) when iterating its development.

Currently, there's only one single working component in flok at a very early stage: a simple, minimalistic time tracker. It is used to record the amount of time being spent on a specific task. All time tracks are only temporarily stored within the browser's local storage since they're intended to be copied over to a another reporting software for now. There's no server-side database as of yet.

## Screenshots

Because everyone likes screen shots:

![flok Time Screenshot](img/timeScreenshot.png)

## Roadmap

After the very first release which is only a small teaser of what's coming, we take up the following steps to push flok forward. Warning: Radical changes in the available features, the architecture of the application and the used frameworks are always possible!

* General features
    * User authentication and authorisation
    * User profiles incl. personal dashboard
    * Persistence through server-side database
    * Real-time sync across devices
* Collaboration-specific features
    * Global team time-line
    * Note-taking tool for meetings/ dailies
    * To-do list

## Targeted Platforms and Browsers
flok works on desktop as well as on modern smartphone and tablet operating system browsers. Generally, only the newest version of the widely spread, standard-compliant browsers are supported:

* Chrome
* Firefox
* Safari
* Android Browser
* Chrome for Android
* Mobile Safari

## Setup and Usage
### Dependencies
To be able to install and run flok, you will need:

* PHP 5.3.8 (or newer)
* Apache web server (or any other you care to configure)
* Git (or you can download the source directly from github)

flok is built with [Symfony2](http://symfony.com/), [AngularJS](http://angularjs.org/) and [Bootstrap 3](http://getbootstrap.com/).
As much as possible, we are going to stay on the latest versions of these frameworks.
You do not need to install Symfony, Angular or Bootstrap separately. The Symfony bundles will be installed through Composer
and Angular as well as Bootstrap are already included in the repository.

### Installation
* Make sure you have the above listed dependencies installed.
* [Fork the repository](https://help.github.com/articles/fork-a-repo) and clone your fork to your computer.
* Browse to the repository root.
* Install all Symfony bundles: `php bin/composer.phar install`.
* The installer will prompt you for a few of configuration values. Choose the default except for:
    * _secret_: Input a randomly generated hexadecimal secret (30 digits or more, for example from
    [random.org](http://www.random.org/cgi-bin/randbyte?nbytes=15&format=h), without the spaces)
* Create the application configuration file _app/config/flok.yml_. If you leave the file empty, the default values are used.
* Run `php app/console config:dump-reference nothing_flok` to see the documentation reference.
* Start up your web server and configure the _web_ folder to be the web root. The web server needs access to the _app_, _src_, _vendor_ and _web_ folders.
Check the [Symfony Quick Tour](http://symfony.com/doc/current/quick_tour/the_big_picture.html) for more details on getting Symfony up and running.
* To check if your server is configured correctly, download the [config.php](https://github.com/symfony/symfony-standard/blob/master/web/config.php)
from Symfony Standard Edition to the _web_ folder and access it from a browser, e.g. [http://localhost/config.php](http://localhost/config.php)
* Done! Access the application in development mode on e.g. [http://localhost/app_dev.php/](http://localhost/app_dev.php/).

#### Preparing for Production
* On the production server, you only need the _app_, _src_, _vendor_ and _web_ folders.
* Remove the _web/app_dev.php_ file (dev mode should not be accessible on production servers).
* Browse to the project root.
* Prepare the production assets: `php app/console assetic:dump -e prod`.
* Warm up the production cache: `php app/console cache:warmup -e prod`.

## Contributing
To extend and contribute to flok, you will have to setup the following additional tools.

* [PHPUnit](https://github.com/sebastianbergmann/phpunit/)
* [NodeJS and npm](http://nodejs.org/)
* Execute `npm install` in the root folder of the project

### Running Tests
#### PHP Tests
* Execute PHPUnit tests: `phpunit -c buildtools/phpunit.xml`

#### Javascript Tests
[Karma](http://karma-runner.github.io/) is installed as a local node module.

* Start Karma: `./node_modules/.bin/karma start buildtools/karma.conf.js`.
* Access [http://localhost:9876/](http://localhost:9876/) with a browser to execute the tests.
* Karma is configured to watch the JavaScript files and re-execute the test when the files are modified.

### JSHint, PHPMD and PHPCS
Please respect the coding standards described in:

* _buildtools/.jshintrc_: [JSHint](http://www.jshint.com/) config file
* _buildtools/phpmd.xml_: [PHP Mess Detector](http://phpmd.org/) config file
* _buildtools/phpcs.xml_: [PHP Code Sniffer](http://pear.php.net/package/PHP_CodeSniffer) config file

### JSDoc
[JSDoc](https://github.com/jsdoc3/jsdoc) is installed as a local node module.

* `jsdoc -c buildtools/jsdoc-conf.json`
* The documentation is generated in the _doc_ folder

## Version History
### 0.2.0
* Initial release: Launched with Time component.

## Copyright and license
* Copyright (c) 2013 Nothing Interactive, Switzerland
* Website: [https://www.nothing.ch/](https://www.nothing.ch/)
* Version: 0.2.0
* License: [The MIT License (MIT)](http://opensource.org/licenses/MIT)
