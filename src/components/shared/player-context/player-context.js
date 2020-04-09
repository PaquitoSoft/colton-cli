/* global YT */
import React, { useContext, useState, useEffect } from 'react';

import Player from '../../../services/player';

const SPACEBAR_KEYCODE = 32;

const PlayerContext = React.createContext({
	player: undefined,
	playerStates: Player.states,
	playerEvents: Player.events,
	status: Player.states.STOPPED,
	currentTrack: undefined,
	progress: {}
});

export function PlayerProvider({ player, children } ) {
	const [status, setStatus] = useState(Player.states.STOPPED);
	const [currentTrack, setCurrentTrack] = useState({});
	
	const providerInitialValue = {
		player,
		status,
		playerStates: Player.states,
		playerEvents: Player.events,
		currentTrack
	};

	const onPlayerNewTrack = ({ newTrack }) => setCurrentTrack(newTrack); 
	const onPlayerNewStatus = ({ newStatus }) => setStatus(newStatus);
	const keyEventListener = (event) => {
		if (event.keyCode === SPACEBAR_KEYCODE && event.target.tagName !== 'INPUT') {
			player.togglePlay();
		}
	};

	useEffect(() => {
		player.addEventListener(Player.events.NEW_TRACK_PLAYING, onPlayerNewTrack);
		player.addEventListener(Player.events.STATUS_CHANGED, onPlayerNewStatus);
		document.body.addEventListener('keyup', keyEventListener);

		window.onYouTubeIframeAPIReady = function() {
			let engine;
			const onReady = () => {
				player.loadEngine(engine);
		
			};

			engine = new YT.Player('yt-player', {
				width: '480',
				height: '270',
				events: { 
					onReady,
					onError: (error) => console.error(error)
				}
			});
		};

		const tag = document.createElement('script');
		tag.src = 'https://www.youtube.com/iframe_api';
		document.body.appendChild(tag);

		return () => {
			player.removeEventListener(Player.events.NEW_TRACK_PLAYING, onPlayerNewTrack);
			player.removeEventListener(Player.events.STATUS_CHANGED, onPlayerNewStatus);
			document.body.removeEventListener('keyup', keyEventListener);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<PlayerContext.Provider value={providerInitialValue}>
			{children}
		</PlayerContext.Provider>
	);
}

export function usePlayerContext() {
	const context = useContext(PlayerContext);
	if (!context) {
		throw new Error('usePlayerContext must be used within an PlayerContext.Provider')
	}
	return context;
}
