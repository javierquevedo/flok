<?php

namespace Nothing\FlokBundle\Test;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase as BaseWebTestCase;

/**
 * Class WebTestCase
 * Extends the WebTestCase from Symfony core and adds helpers methods to be
 * able to easily test JSON APIs.
 *
 * @package Nothing\FlokBundle\Test
 */
class WebTestCase extends BaseWebTestCase
{
    protected function getAssertedFlokAPIResponse($method, $url, array $parameters = array(), $mustBeSuccessful = true)
    {
        $respObj = $this->getAssertedJSONResponse($method, $url, $parameters, $mustBeSuccessful);

        // Test if success has correct value
        $this->assertAttributeInternalType('boolean', 'success', $respObj);
        $this->assertEquals($mustBeSuccessful, $respObj->success, 'success has wrong value');

        return $respObj;
    }

    /**
     * Makes a request on the given url and makes some basic checks on the response
     *
     * @param string $method
     * @param string $url
     * @param array  $parameters
     * @param bool   $mustBeSuccessful
     *
     * @return array
     */
    protected function getAssertedJSONResponse($method, $url, array $parameters = array(), $mustBeSuccessful = true)
    {
        $client = $this->request($method, $url, $parameters);
        $response = $client->getResponse();
        $this->assertEquals($mustBeSuccessful, $response->isSuccessful(), 'HTTP request was expected to be ' . ($mustBeSuccessful ? 'successful' : 'unsuccessful') . ', got: ' . $response);

        $content = $response->getContent();
        $respObj = json_decode($content);
        $this->assertNotNull($respObj, 'Response is not valid JSON:' . "\n" . $content);

        return $respObj;
    }

    /**
     * Makes a request with the given parameters and returns the client
     *
     * @param string $method     Request method
     * @param string $url        URL to make the request to
     * @param array  $parameters Request parameters
     *
     * @return \Symfony\Bundle\FrameworkBundle\Client
     */
    protected function request($method, $url, array $parameters = array())
    {
        // Get the test client and send the request
        $client = static::createClient();
        $client->request($method, $url, $parameters);

        return $client;
    }
}
