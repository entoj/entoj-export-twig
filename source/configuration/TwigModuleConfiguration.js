'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('entoj-system').Base;
const BuildConfiguration = require('entoj-system').model.configuration.BuildConfiguration;
const GlobalConfiguration = require('entoj-system').model.configuration.GlobalConfiguration;
const assertParameter = require('entoj-system').utils.assert.assertParameter;


/**
 * @memberOf configuration
 */
class TwigModuleConfiguration extends Base
{
    /**
     * @param  {model.configuration.GlobalConfiguration} globalConfiguration
     */
    constructor(globalConfiguration, buildConfiguration, options)
    {
        super();

        //Check params
        assertParameter(this, 'globalConfiguration', globalConfiguration, true, GlobalConfiguration);
        assertParameter(this, 'buildConfiguration', buildConfiguration, true, BuildConfiguration);

        // Create configuration
        const prefix = options
            ? options.prefix || 'twig'
            : 'twig';
        this._configurationName = buildConfiguration.get(prefix + '.configurationName', globalConfiguration.get(prefix + '.configurationName', prefix));
        this._exportPath = buildConfiguration.get(prefix + '.exportPath', globalConfiguration.get(prefix + '.exportPath', '${cache}/${configurationName}/export'));
        this._basePath = buildConfiguration.get(prefix + '.basePath', globalConfiguration.get(prefix + '.basePath', ''));
        this._includePath = buildConfiguration.get(prefix + '.includePath', globalConfiguration.get(prefix + '.includePath', ''));
        this._fileExtension = buildConfiguration.get(prefix + '.fileExtension', globalConfiguration.get(prefix + '.fileExtension', '.html'));
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [GlobalConfiguration, BuildConfiguration, 'configuration/TwigModuleConfiguration.options'] };
    }


    /**
     * @inheritDocss
     */
    static get className()
    {
        return 'configuration/TwigModuleConfiguration';
    }


    /**
     * Provides variables to use in path resolving
     *
     * @type {Object}
     */
    get variables()
    {
        return {
            configurationName: this._configurationName
        };
    }


    /**
     * The name of the export configurations for entities.
     *
     * @type {String}
     */
    get configurationName()
    {
        return this._configurationName;
    }


    /**
     * The path to the folder where files are exported to
     *
     * @type {String}
     */
    get exportPath()
    {
        return this._exportPath;
    }


    /**
     * The base path for exported jsp artefacts
     *
     * @type {String}
     */
    get basePath()
    {
        return this._basePath;
    }


    /**
     * The base url for included jsp artefacts
     *
     * @type {String}
     */
    get includePath()
    {
        return this._includePath;
    }


    /**
     * @type {String}
     */
    get fileExtension()
    {
        return this._fileExtension;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.TwigModuleConfiguration = TwigModuleConfiguration;
