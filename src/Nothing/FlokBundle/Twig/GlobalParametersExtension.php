<?php

namespace Nothing\FlokBundle\Twig;

use Symfony\Component\HttpKernel\KernelInterface;

/**
 * Class GlobalParametersExtension
 * Makes all Symfony parameters available in twig with a simple filter.
 * @package Nothing\FlokBundle\Twig
 */
class GlobalParametersExtension extends \Twig_Extension
{
    /**
     * @var \Symfony\Component\DependencyInjection\ContainerInterface
     */
    protected $container;

    /**
     * @param KernelInterface $kernel
     */
    public function __construct(KernelInterface $kernel)
    {
        $this->container = $kernel->getContainer();
    }

    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('param', array($this, 'paramFilter')),
        );
    }

    /**
     * Returns the value of the given Symfony parameter
     * @param $paramName
     *
     * @return mixed
     * @throws InvalidArgumentException if the parameter is not defined
     */
    public function paramFilter($paramName)
    {
        return $this->container->getParameter($paramName);
    }

    public function getName()
    {
        return 'global_parameters_extension';
    }
}
