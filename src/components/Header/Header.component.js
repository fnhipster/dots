import './Header.styles.css';

import { createElement } from '../../lib/element';

import { SpeedControlComponent } from '../SpeedControl/SpeedControl.component';
import { ScoreComponent } from '../Score/Score.component';


export const HeaderComponent = function() {
  return (
    createElement('div', { class: 'game__header' },
      createElement(ScoreComponent),
      createElement(SpeedControlComponent)
    )
  );
}

