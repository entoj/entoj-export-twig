'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeRenderer = require('entoj-system').export.renderer.NodeRenderer;
const MissingConfigurationError = require('entoj-system').error.MissingConfigurationError;
const prepareArguments = require('entoj-system').export.renderer.helper.prepareArguments;
const co = require('co');


/**
 * Renders a macro call
 */
class TwigCallNodeRenderer extends NodeRenderer
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.renderer/TwigCallNodeRenderer';
    }


    /**
     * @return {Promise<Boolean>}
     */
    willRender(node, configuration)
    {
        return Promise.resolve(node && node.is('CallNode'));
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
        const promise = co(function*()
        {
            let result = '';

            // Get macro
            const macroConfiguration = yield configuration.getMacroConfiguration(node.name);
            if (!macroConfiguration)
            {
                throw new MissingConfigurationError('CallNodeRenderer::render - no configuration for macro ' + node.name + ' found.');
            }
            configuration.registerMacroUsage(macroConfiguration);

            // Get arguments
            const args = prepareArguments(node, macroConfiguration, configuration, 'nodes');

            // Render
            if (node.children.length)
            {
                result+= '{% call ' + node.name + '(';
            }
            else
            {
                result+= '{{ ' + node.name + '(';
            }
            let isFirst = true;
            for (const arg in args)
            {
                if (!isFirst)
                {
                    result+= ', ';
                }
                isFirst = false;
                result+= yield configuration.renderer.renderNode(args[arg].value, configuration);    
            }
            if (node.children.length)
            {
                result+= ') %}';
            }
            else
            {
                result+= ') }}';
            }            
            if (node.children.length)
            {
                result+= yield configuration.renderer.renderList(node.children, configuration);                
                result+= '{% endcall %}';
            }


            return result;
        });
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.TwigCallNodeRenderer = TwigCallNodeRenderer;
