'use strict';

// Requirements
const Configuration = require('entoj-system').export.Configuration;
const TwigModuleConfiguration = require('../configuration/TwigModuleConfiguration.js').TwigModuleConfiguration;
const assertParameter = require('entoj-system').utils.assert.assertParameter;


/**
 * @memberOf export.fluid
 * @extends export.Configuration
 */
class TwigConfiguration extends Configuration
{
    /**
     * @ignore
     */
    constructor(entity, macro, settings, parser, renderer, transformer, globalRepository, buildConfiguration, moduleConfiguration)
    {
        super(entity, macro, settings, parser, renderer, transformer, globalRepository, buildConfiguration);

        // Check params
        assertParameter(this, 'moduleConfiguration', moduleConfiguration, true, TwigModuleConfiguration);

        // Assign options
        this._moduleConfiguration = moduleConfiguration;
        this._identifier = moduleConfiguration.configurationName;
        this._macroCalls = {};
        this._macroCallsStash = [];
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export/TwigConfiguration';
    }


    /**
     * @type {configuration.TwigConfiguration}
     */
    get moduleConfiguration()
    {
        return this._moduleConfiguration;
    }


    /**
     * @type {Object}
     */
    get macroCalls()
    {
        return this._macroCalls;
    }


    /**
     * @param {Object} macroConfiguration
     */
    addMacroCalls(calls)
    {
        for (const call in calls)
        {
            this.addMacroCall(calls[call]);
        }
    }


    /**
     * @param {Object} macroConfiguration
     */
    addMacroCall(macroConfiguration)
    {
        this._macroCalls[macroConfiguration.site.name + ':' + macroConfiguration.macro.name] = macroConfiguration;
    }


    /**
     * Clears all recorded macro calls
     */
    resetMacroCalls()
    {
        this._macroCalls = {};
        this._macroCallsStash = [];
    }


    /**
     * Saves all macro calls to the stash
     */
    saveMacroCalls()
    {
        this._macroCallsStash.push(this._macroCalls);
        this._macroCalls = {};
    }


    /**
     * Restores the last saved macro calls from the stash
     */
    restoreMacroCalls(append)
    {
        if (this._macroCallsStash.length == 0)
        {
            if (!append)
            {
                this._macroCalls = {};
            }
            return;
        }
        if (append)
        {
            this.addMacroCalls(this._macroCallsStash.pop());
        }
        else
        {
            this._macroCalls = this._macroCallsStash.pop();
        }
    }


    /**
     * @inheritDoc
     */
    getFilePath(configuration)
    {
        let result = '';
        if (this.settings.filename)
        {
            if (this.settings.filename.indexOf('/') === -1)
            {
                result+= this.moduleConfiguration.basePath + configuration.entity.id.site.name.urlify() + '/' + configuration.entity.id.category.pluralName.urlify() + '/';
            }
        }
        else
        {
            result = this.moduleConfiguration.basePath + configuration.entity.id.site.name.urlify() + '/' + configuration.entity.id.category.pluralName.urlify() + '/';
        }
        return result;
    }


    /**
     * @inheritDoc
     */
    getIncludePath(configuration)
    {
        return this.moduleConfiguration.includePath + configuration.entity.id.site.name.urlify() + '/' + configuration.entity.id.category.pluralName.urlify() + '/';
    }


    /**
     * @inheritDoc
     */
    refineConfiguration(configuration)
    {
        const result = configuration;
        result.moduleConfiguration = this.moduleConfiguration;
        if (this.settings.filename)
        {
            result.filename = '';
            if (this.settings.filename.indexOf('/') === -1)
            {
                result.filename+= this.getFilePath(configuration);
            }
            result.filename+= (this.settings.filename.substr(0, this.settings.filename.lastIndexOf('.')) || this.settings.filename);
        }
        else
        {
            result.filename = this.getFilePath(configuration);
            if (result.macro)
            {
                result.filename+= result.macro.name.replace(/_/g, '-');
            }
            else
            {
                result.filename+= result.entity.idString.replace(/_/g, '-');
            }
        }
        if (!result.filename.endsWith(this.moduleConfiguration.fileExtension))
        {
            result.filename+= this.moduleConfiguration.fileExtension;
        }

        result.includePath = this.getIncludePath(configuration);
        if (result.macro)
        {
            result.includePath+= result.macro.name.replace(/_/g, '-');
        }
        else
        {
            result.includePath+= result.entity.idString.replace(/_/g, '-');
        }
        if (!result.includePath.endsWith(this.moduleConfiguration.fileExtension))
        {
            result.includePath+= this.moduleConfiguration.fileExtension;
        }

        return Promise.resolve(result);
    }
}


// Exports
module.exports.TwigConfiguration = TwigConfiguration;
