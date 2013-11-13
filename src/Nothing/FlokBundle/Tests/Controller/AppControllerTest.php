<?php

namespace Nothing\FlokBundle\Tests\Controller;

use Nothing\FlokBundle\Test\WebTestCase;

class AppControllerTest extends WebTestCase
{
    public function testIndex()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/');

        $this->assertTrue($client->getResponse()->isSuccessful(), 'Can get to App');

        $this->assertGreaterThan(0, $crawler->filter('*[ng-controller=AppCtrl]')->count());
    }
}
