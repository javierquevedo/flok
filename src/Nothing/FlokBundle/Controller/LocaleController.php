<?php

namespace Nothing\FlokBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class LocaleController extends Controller
{
    public function localeAction($locale)
    {
        // TODO: move all the translations to the frontend
        // Get the catalogue from the translator
        $catalogue = $this->get('translator')->getCatalogue($locale);

        // Retrieve all messages
        // TODO: expose a config options that allows to set the message domains that are returned
        $messages = $catalogue->all('messages');

        // Return it as JSON
        return new JsonResponse($messages);
    }
}
