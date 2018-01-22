import './Dot.styles.css';

import { createElement } from '../../lib/element';

export const DotComponent = function ({ colorIndex, size, position, speed }) {

  return createElement('div', { 
    class: `game__dot game__dot--color--${colorIndex}`,
    style: {
      '--size': `${size}px`,
      '--x-position': `${position[0]}px`,
      '--y-position': `${position[1]}px`,
      '--speed': `${speed}s`
    }
  });

}