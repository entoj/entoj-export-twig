'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeRenderer = require('entoj-system').export.renderer.NodeRenderer;
const co = require('co');


/**
 *
 */
class TwigInlineIfNodeRenderer extends NodeRenderer
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.renderer/TwigInlineIfNodeRenderer';
    }


    /**
     * @return {Promise<Boolean>}
     */
    willRender(node, configuration)
    {
        return Promise.resolve(node && node.is('IfNode') && node.parent.is('OutputNode'));
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
            result+= '(';
            result+= yield configuration.renderer.renderNode(node.condition, configuration);
            result+= ') ? ';
            result+= yield configuration.renderer.renderList(node.children, configuration);
            if (node.elseChildren.length)
            {
                result+= ' : ';
                result+= yield configuration.renderer.renderList(node.elseChildren, configuration);
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
module.exports.TwigInlineIfNodeRenderer = TwigInlineIfNodeRenderer;
