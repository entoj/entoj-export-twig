'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeListRenderer = require('entoj-system').export.renderer.NodeListRenderer;
const prepareParameters = require('entoj-system').export.renderer.helper.prepareParameters;
const co = require('co');


/**
 * Renders a macro
 */
class TwigMacroNodeRenderer extends NodeListRenderer
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.renderer/TwigMacroNodeRenderer';
    }


    /**
     * @return {Promise<Boolean>}
     */
    willRender(node, configuration)
    {
        return Promise.resolve(node && node.is('MacroNode'));
    }


    /**
     * @return {Promise<Boolean>}
     */
    addParameters(node, configuration)
    {
        return Promise.resolve('');
    }


    /**
     * @return {Promise<String>}
     */
    render(node, configuration)
    {
        if (!node || !configuration)
        {
            return Promise.resolve('');
        }
        const scope = this;
        const promise = co(function*()
        {
            // Prepare
            let result = '';
            const macroConfiguration = yield configuration.getMacroConfiguration(node.name);

            // Name
            result+= '{% macro ' + node.name + '(';

            // Parameters
            const parameters = prepareParameters(node, macroConfiguration, configuration, 'literals');
            let isFirst = true;
            for (const paramName in parameters)
            {
                if (!isFirst)
                {
                    result+= ', ';
                }
                result+= paramName;
                if (parameters[paramName].value !== null)
                {
                    result+= ' = ' + parameters[paramName].value;
                }
                isFirst = false;
            }
            result+= yield scope.addParameters(isFirst, node, configuration);
            if (!isFirst)
            {
                result+= ', ';
            }
            result+= 'caller';
            result+= ') %}';

            // Store current usage
            configuration.saveMacroCalls();

            // Generate body
            const body = yield configuration.renderer.renderList(node.children, configuration);

            // Add imports
            isFirst = true;
            for (const callName in configuration.macroCalls)
            {
                if (isFirst)
                {
                    result+= '\n';
                    isFirst = false;
                }
                const call = configuration.macroCalls[callName];
                call.addedInclude = true;
                result+= '{% from \'' + call.includePath + '\' import ' + call.macro.name + ' %}\n';
            }

            // Restore usage
            configuration.restoreMacroCalls(true);

            // Add body
            result+= body;

            // End
            result+= '{% endmacro %}';

            return result;
        });
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.TwigMacroNodeRenderer = TwigMacroNodeRenderer;
