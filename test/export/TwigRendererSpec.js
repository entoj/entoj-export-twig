'use strict';

/**
 * Requirements
 */
const TwigRenderer = require(TWIG_SOURCE + '/export/TwigRenderer.js').TwigRenderer;
const TwigConfiguration = require(TWIG_SOURCE + '/export/TwigConfiguration.js').TwigConfiguration;
const TwigModuleConfiguration = require(TWIG_SOURCE + '/configuration/TwigModuleConfiguration.js').TwigModuleConfiguration;
const TwigNodeRenderers = require(TWIG_SOURCE + '/export/renderer/index.js');
const rendererSpec = require('entoj-system/test').export.RendererShared;
const projectFixture = require('entoj-system/test').fixture.project;


/**
 * Spec
 */
describe(TwigRenderer.className, function()
{
    /**
     * Renderer Test
     */
    const testFixtures =
    {
        'should render conditions': 'conditions',
        'should render assignments': 'assignments',
        'should render calls': 'calls',
        'should render loops': 'loops',
        //'should render filter': 'filter',
        'should render macros': 'macro'
    };
    const options =
    {
        configurationCreator: function(entity, macro, settings, parser, renderer, transformer, globalRepository, buildConfiguration)
        {
            const moduleConfiguration = new TwigModuleConfiguration(global.fixtures.globalConfiguration, global.fixtures.buildConfiguration);
            return new TwigConfiguration(entity, macro, settings, parser, renderer, transformer, globalRepository, buildConfiguration, moduleConfiguration);
        },
        fixtureInputPath: TWIG_FIXTURES + '/renderer',
        fixtureExpectedPath: TWIG_FIXTURES + '/renderer',
        createFixture: () => projectFixture.createDynamic()
    };
    const prepareParameters = (parameters) =>
    {
        global.fixtures.context.di.map('nunjucks.filter/ImageUrlFilter.dataProperties', ['src']);
        global.fixtures.context.di.map('nunjucks.filter/LinkUrlFilter.dataProperties', ['url']);
        const classes = TwigNodeRenderers.rendererList;
        const nodeRenderers = global.fixtures.context.createInstances(classes);
        return [nodeRenderers];
    };
    rendererSpec(TwigRenderer, 'export/TwigRenderer', prepareParameters, testFixtures, options);
});
