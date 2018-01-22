/**
 * @typedef {Object} Store 
 * @property {string|number} key property name
 */


/**
 * Create a state container for the application with a give. 
 * Note: the model is static and new properties cannot be added later.
 * You must define the schema of the model with its default values.
 * @param {Object} model - Schema object with default values.
 * @returns {Store} - state container
 */
export const createStore = (model = {}) => {
  console.log('[Store] Creating New Store', model);
  
  return new Proxy(model, {
    
    get: (target, key) => target[key],

    set: (target, key, value) => {
      
      /*** The store has a static model that is set on creation. */
      if (key in target) {
        /***
         * Data binding: trigger event to notify elemements of updates
         * - only when the value has changed.
         */
        if (target[key] !== value){ 
          target[key] = value;
          const event = new CustomEvent(`storeupdate--${key}`, { detail: value });
          document.dispatchEvent(event);
        }

        return true;
      } else {
        throw `The property "${key}" does not exist in store. \n\nAvailable Properties ${JSON.stringify(target, null, 2)}`;
        return false;
      }

    }
  })   
};

/**
 * Executes callback with the value of the updated store property.
 * @param {string} key - Store property keyp
 * @param {requestCallback} next - Callback
 */
export const onStoreUpdate = (key, next) => {
  document.addEventListener(`storeupdate--${key}`, e => next(e.detail));
}