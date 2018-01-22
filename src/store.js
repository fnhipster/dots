import { createStore } from './lib/store';

/**
 * Store to manage the state of the game.
 */
export const store = createStore({
  score: 0,
  speed: 10,
  isActive: true
});