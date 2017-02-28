import Lexon from './core/Lexon.js';
import Grammar from './grammar';
import Html from './utils/HtmlUtils.es6';
import Morphology from './morphology';

const OPERATORS = [Html, Morphology, Grammar];

/**
 * Lexon API.
 *
 */
export default {

    init(meta) {

        OPERATORS.forEach(e => e.init(meta));
    },

    apply(text) {

        return Lexon.from({ text }).apply(OPERATORS);
    }
};
