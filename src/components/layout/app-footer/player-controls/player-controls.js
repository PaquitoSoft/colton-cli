import React, { useEffect, useState } from 'react';

import { useAppContext } from '../../../shared/app-context/app-context';
import Player from '../../../../services/player';

import { ReactComponent as PlayIcon } from './play-icon.svg';
import { ReactComponent as PauseIcon } from './pause-icon.svg';
import { ReactComponent as PreviousIcon } from './previous-icon.svg';
import { ReactComponent as NextIcon } from './next-icon.svg';

import './player-controls.css';

function PlayerControls({ className = '' }) {
	const { player } = useAppContext();
	const [playerStatus, setPlayerStatus] = useState(player.getStatus());

	useEffect(() => {
		const onPlayerStatusChanged = ({ newStatus }) => setPlayerStatus(newStatus);
		player.addEventListener(Player.events.STATUS_CHANGED, onPlayerStatusChanged);
		return () => player.removeEventListener(Player.events.STATUS_CHANGED, onPlayerStatusChanged)
	}, [player]);
	
	console.log('PlayerControls# Player status:', playerStatus);
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
					Player.states.PLAYING === playerStatus && 
					<PauseIcon 
						className="icon" 
						onClick={() => player.pause()}
					/>
				}
				{
					Player.states.PLAYING !== playerStatus && 
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
