import './Game.styles.css';

import { createElement } from '../../lib/element';

import { store } from '../../store';

import { HeaderComponent } from '../Header/Header.component';
import { ViewportComponent } from '../Viewport/Viewport.component';

export const GameComponent = function() {

  return (

    createElement(`div`, { 
        class: 'game',
        init: () => {
          /*** Pause the viewport if the game is not visible. i.e. another tab is selected */
          document.addEventListener('visibilitychange', () => {
            console.log(document.hidden ? '[Game] Paused' : '[Game] Playing');
            store.isActive = !document.hidden;
          });
        }
      },
      
      createElement(HeaderComponent),
      createElement(ViewportComponent)
    )

  );
  
};