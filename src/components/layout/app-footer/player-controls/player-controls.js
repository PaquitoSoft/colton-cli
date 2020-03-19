import React from 'react';

import { ReactComponent as PlayIcon } from './play-icon.svg';
// import { ReactComponent as PauseIcon } from './pause-icon.svg';
import { ReactComponent as PreviousIcon } from './previous-icon.svg';
import { ReactComponent as NextIcon } from './next-icon.svg';

import './player-controls.css';

function PlayerControls({ className = '' }) {
	return (
		<div className={`player-controls ${className}`}>
			<span className="player-controls__control"><PreviousIcon className="icon" /></span>
			<span className="player-controls__control"><PlayIcon className="icon" /></span>
			<span className="player-controls__control"><NextIcon className="icon" /></span>
		</div>
	);
}

export default PlayerControls;
