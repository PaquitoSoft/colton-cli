import React from 'react';

import { useAppContext } from '../../../shared/app-context/app-context';
import { PLAYER_STATES } from '../../../../services/player';

import { ReactComponent as PlayIcon } from './play-icon.svg';
import { ReactComponent as PauseIcon } from './pause-icon.svg';
import { ReactComponent as PreviousIcon } from './previous-icon.svg';
import { ReactComponent as NextIcon } from './next-icon.svg';

import './player-controls.css';

function PlayerControls({ className = '' }) {
	const { player, playerStatus } = useAppContext();
	
	console.log('PlayerControls# Player status:', playerStatus);
	return (
		<div className={`player-controls ${className}`}>
			<span className="player-controls__control"><PreviousIcon className="icon" /></span>
			<span className="player-controls__control">
				{
					PLAYER_STATES.PLAYING === playerStatus && 
					<PauseIcon 
						className="icon" 
						onClick={() => player.pause()}
					/>
				}
				{
					PLAYER_STATES.PLAYING !== playerStatus && 
					<PlayIcon 
						className="icon" 
						onClick={() => player.play()}
					/>
				}
			</span>
			<span className="player-controls__control"><NextIcon className="icon" /></span>
		</div>
	);
}

export default PlayerControls;
