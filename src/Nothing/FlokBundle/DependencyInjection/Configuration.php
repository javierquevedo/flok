<?php

namespace Nothing\FlokBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * Class Configuration
 * @package Nothing\FlokBundle\DependencyInjection
 */
class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('nothing_flok');

        $rootNode
            ->children()
            ->scalarNode('production_domain')
                ->defaultValue('')
                ->info('Production domain of flok. Used to change colour scheme on non-production domains.')
                ->example('flok.to')
            ->end()
            ->arrayNode('piwik')
                ->addDefaultsIfNotSet()
                ->children()
                    ->booleanNode('enable')
                        ->defaultFalse()
                        ->info('Whether to enable tracking of the application with Piwik. A valid URL must be set.')
                    ->end()
                    ->scalarNode('url')
                        ->defaultNull()
                        ->info('URL of the Piwik server. Do not add http:// or https://, this will be added automatically.')
                        ->example('example.com/piwik')
                    ->end()
                    ->scalarNode('siteId')
                        ->defaultValue(1)
                        ->info('Piwik siteId: the ID given by Piwik for this site')
                    ->end()
                ->end()
            ->end();

        return $treeBuilder;
    }
}
