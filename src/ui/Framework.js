import UiComponent from './Component.js';
import { objMap } from '../utils/obj.js';

export { renderer as StringRenderer } from './string/StringRenderer.js';
export { renderer as DomRenderer } from './dom/DOMRenderer.js';

export const Component = UiComponent;

function createDefaultRootType(markup, state) {

  return class $Root extends Component {

    static TEMPLATE = markup;

    static PROPS = objMap(state, (val, key) => ({}));
  };
}

/**
 * Bootstraps framework with config object which contains following params:
 * @param renderer - function to be used to renderer components
 * @param Root - root component type
 * @param markup - used to implicitly create root component type id none specified
 * @param state - used to implicitly create root component type id none specified
 * @param parentElt - dom element container for DomRenderer
 * @param componentTypes list of types to registerType
 *
 * @return a function to be invoked to re-render root component
 */
export function bootstrap(config) {

  const { markup, state = {}, Root, componentTypes = [] } = config;

  const $Root = Root || createDefaultRootType(markup, state);

  Component.registerType($Root, ...componentTypes);

  const root = new $Root(state);

  root.$renderParams = config;

  root.onInit();

  return () => root.invalidate();
}
