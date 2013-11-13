<?php

namespace Nothing\FlokBundle\DependencyInjection;

use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\ContainerBuilder;

/**
 * Class NothingFlokExtension
 * @package Nothing\FlokBundle\DependencyInjection
 */
class NothingFlokExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);
        $this->recursiveSetParameters(array('nothing_flok'), $config, $container);
    }

    /**
     * Recursively goes through the config array given and adds the config
     * values to the container.
     *
     * @param array            $path Root path element to add the params to
     * @param array            $config The config array to add
     * @param ContainerBuilder $container
     */
    protected function recursiveSetParameters(array $path, array $config, ContainerBuilder $container)
    {
        foreach ($config as $name => $value) {
            $newPath = $path;
            $newPath[] = $name;
            if (is_scalar($value) || is_null($value) || (is_array($value) && (isset($value[0]) || !count($value)))) {
                $container->setParameter(implode('.', $newPath), $value);
            }
            else {
                $this->recursiveSetParameters($newPath, $value, $container);
            }
        }
    }
}
