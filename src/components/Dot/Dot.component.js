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
    },
    onAnimationStart: ({animationName}) => {
      /*** Happy birthday Dot */
      if (animationName === 'animation-fall') {
        console.log('[Dot] Hey look at me! I\'m Dot');
      }
    },
    onAnimationEnd: ({animationName, target}) => {
      /*** Nothing is forever.  */
      if (animationName === 'animation-fall' || animationName === 'animation-pop') {
        console.log('[Dot] R.I.P.');
        target.remove();
      }
    }
  });

}