<?php

namespace Nothing\FlokBundle\Tests\Controller;

use Nothing\FlokBundle\Test\WebTestCase;

class LocaleControllerTest extends WebTestCase
{
    public function testLocale()
    {
        $response = $this->getAssertedJSONResponse('GET', '/locale/en.json');

        $this->assertAttributeEquals('flok', 'flok.title', $response, 'en locale has correct translation of flok.title');
    }
}
