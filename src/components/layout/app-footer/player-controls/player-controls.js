import React from 'react';

import { usePlayerContext } from '../../../shared/player-context/player-context';
import Player from '../../../../services/player';

import { ReactComponent as PlayIcon } from './play-icon.svg';
import { ReactComponent as PauseIcon } from './pause-icon.svg';
import { ReactComponent as PreviousIcon } from './previous-icon.svg';
import { ReactComponent as NextIcon } from './next-icon.svg';

import './player-controls.css';

function PlayerControls({ className = '' }) {
	const { player, status } = usePlayerContext();
	
	console.log('PlayerControls# Player status:', status);
	return (
		<div className={`player-controls ${className}`}>
			<span className="player-controls__control">
				<PreviousIcon 
					className="icon"
					onClick={() => player.previous()}
				/>
			</span>
			<span className="player-controls__control">
				{
					Player.states.PLAYING === status && 
					<PauseIcon 
						className="icon" 
						onClick={() => player.pause()}
					/>
				}
				{
					Player.states.PLAYING !== status && 
					<PlayIcon 
						className="icon" 
						onClick={() => player.play()}
					/>
				}
			</span>
			<span className="player-controls__control">
				<NextIcon 
					className="icon" 
					onClick={() => player.next()}
				/>
			</span>
		</div>
	);
}

export default PlayerControls;
