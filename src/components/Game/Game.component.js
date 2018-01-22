import './Game.styles.css';

import { createElement } from '../../lib/element';

import { store } from '../../store';

import { ViewportComponent } from '../Viewport/Viewport.component';
import { SpeedControlComponent } from '../SpeedControl/SpeedControl.component';
import { ScoreComponent } from '../Score/Score.component';

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
      
      createElement('div', { class: 'game__header' },
        createElement(ScoreComponent),
        createElement(SpeedControlComponent)
      ),

      createElement(ViewportComponent)
    )

  );
  
};