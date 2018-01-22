import '../public/main.css';

import { createStore } from './lib/element';

import { GameComponent } from './components/Game/Game.component';

/** Add application to the DOM */
document.getElementById('app').appendChild(GameComponent());
