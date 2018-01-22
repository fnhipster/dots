import './Viewport.styles.css';

import { createElement } from '../../lib/element';
import { onStoreUpdate } from '../../lib/store';
import { getRandomNumber } from '../../lib/helpers';

import { store } from '../../store';

import { DotComponent } from '../Dot/Dot.component';

export const ViewportComponent = () => {

  const appendNewDot = (viewport) => {

    /*** Dots fall at a constant rate. Speed is in pixels per second */
    const speed = (viewport.offsetHeight / store.speed);

    /*** Dots have random colors */
    const colorIndex = getRandomNumber(1,5);

    /*** Dots should vary randomly in size from 10px in diameter to 100px in diameter. */
    const size = getRandomNumber(10, 100);

    /***
     * New dots appear at a random horizontal position at the top of the box.
     * A dot should not "hang" off the left or right edge of the screen. 
     */
    const position = [
      getRandomNumber(0, (viewport.offsetWidth - size)), // x
      viewport.offsetHeight // y
    ];
    
    /*** Create a Dot element */
    const dotComponent = createElement(DotComponent, {
      size,
      speed,
      colorIndex,
      position,
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
          /*** A new dot should appear at the top of the page 1000ms later */
          setTimeout(() => appendNewDot(viewport), 1000);
        }
      },
      onClick: ({target}) => {
        /*** 
         * The score should be incremented by a value inversely proportional to the size of the dot, 
         * with 10px dots worth 10 points, and 100px dots worth 1 point.
         */
        const newScore = Math.round(100 / size);
        store.score = store.score + newScore;
        console.log(`[Dot] Pop! +${newScore}`);

        /*** Pop bubble */
        target.classList.add('game__dot--popped');
      }
    });

    /** Append Dot to Viewport */
    viewport.appendChild(dotComponent);
  };
  
  return createElement('div', { 
    class: 'game__viewport',

    onAnimationStart:  ({animationName, target}) => {
      if (animationName === 'animation-fadein') {
        
        /*** When the game starts, a new dot should appear on the playing area. */
        appendNewDot(target);

        /*** A new dot should also appear every 1000ms. */
        appendNewDot(target);
        const timer = window.setInterval(() => store.isActive && appendNewDot(target), 1000);
      }
    },
  });
}