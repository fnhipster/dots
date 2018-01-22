import './Score.styles.css'

import { createElement } from '../../lib/element';
import { onStoreUpdate, createStore } from '../../lib/store';

export const ScoreComponent = () => {
  
  return createElement('div', { class: 'game__score' },
  
    createElement('span', { 
      class: 'game__score__value',
      init: component => {
        onStoreUpdate('score', v => {
          /*** Lets toggle the game__score--update class to trigger css animations */
          component.classList.remove('game__score__value--updated');
          component.offsetWidth; // triggers re-flow
          component.classList.add('game__score__value--updated');

          /*** Update the Score */
          component.textContent = v;
        });
      }
    }, '0')
    
  );

}