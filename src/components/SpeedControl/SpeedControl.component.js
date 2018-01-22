import './SpeedControl.styles.css';

import { createElement } from '../../lib/element';

import { store } from '../../store';

export const SpeedControlComponent = () => {

  /*** 
   * A player should be able to use a slider to control the rate at which dots fall,
   * with a range of 10-100 pixels per second.
   */
  const max = 100;
  const min = 10;
  const step = 1;
  
  /*** Set starting speed to be the minimum in the range */
  const value = store.speed = min;

  return (
    createElement('div', { class: 'game__speed-control' },
      
    createElement('span', { class: 'game__speed-control__icon' }),
    
      createElement('input', { 
        class: 'game__speed-control__range',
        type: 'range',
        'aria-label': 'Speed',
        max,
        min,
        step,
        value,
        onChange: ({target}) => {
          store.speed = target.value;
        }
      })

    )
  )
}
