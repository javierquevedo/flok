<?php

namespace Nothing\FlokBundle\Service;

use Symfony\Bundle\FrameworkBundle\Translation\Translator as BaseTranslator;

class Translator extends BaseTranslator
{
    /**
     * Returns the catalogue of the given locale. Will try and load it if not
     * already done.
     *
     * @param null $locale If null, the current locale is used
     *
     * @return \Symfony\Component\Translation\MessageCatalogueInterface
     */
    public function getCatalogue($locale = null)
    {
        if (null === $locale) {
            $locale = $this->getLocale();
        }

        if (!isset($this->catalogues[$locale])) {
            $this->loadCatalogue($locale);
        }

        return $this->catalogues[$locale];
    }
}
