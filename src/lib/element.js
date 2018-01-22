/**
 * A node in the DOM tree.
 *
 * @external Node
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node Node}
 */


/**
 * Creates and return a new DOM element
 * @param {string|requestCallback} element - DOM tag name, or another createElement function
 * @param {Object} props - Properties
 * @param {*} children - all arguments will be appended as node children.
 * @returns {external:Node} = DOM element
 */
export const createElement = (element, props = {}, ...children) => {
  
  /*** 
   * Return executed element with properties if the element is a function
   * Otherwise, lets create a new DOM element
  */
  const container = (typeof element === 'function') ? element(props || {}) : document.createElement(element);

  /*** Apply properties accordingly */
  Object.keys(props).forEach(p => {
    
    /*** Init method */
    if (p === 'init') {
      return props[p](container);
    }

    /*** To bind JS events. Pass it as a camel-case property name with the prefix "on" */
    if (/^on(.*)$/.test(p)) {
      return container.addEventListener(p.substring(2).toLowerCase(), props[p]);
    } 

    /*** Apply inline styles */
    if (p === 'style') {
      return Object.keys(props[p]).forEach(s => container.style.setProperty(s, props[p][s]));   
    }

    /*** Set all other attributes */
    container.setAttribute(p, props[p])
  });
  
  /*** An element could have either a text node, or another element as children */
  children.forEach(c => {
    if (c) {
      container.appendChild(typeof c === 'string' ? document.createTextNode(c) : c)
    }
  });

  return container;
};