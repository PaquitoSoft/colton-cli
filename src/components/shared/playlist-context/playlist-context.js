import React, { createContext, useReducer, useContext } from 'react';

const noop = () => false;

const ACTIONS = {
	ADD: 'ADD',
	REMOVE: 'REMOVE',
	RESET: 'RESET',
	NEW_PLAYLIST: 'NEW_PLAYLIST'
};

const PlaylistContext = createContext({
	playlist: [],
	addTrack: noop,
	removeTrack: noop,
	reset: noop,
	loadNewPalylist: noop
});

function playlistReducer(playlist, action) {
	console.log('Playslit Action:', action);
	// eslint-disable-next-line default-case
	switch (action.type) {
		// TODO Save new tracks list in local cache
		case ACTIONS.NEW_PLAYLIST:
			return { ...action.payload.playlist }
			case ACTIONS.ADD:
				return {
					...playlist,
				tracks: [...playlist.tracks].push(action.payload.track)
			};
		case ACTIONS.REMOVE:
			return {
				...playlist,
				tracks: [...playlist.tracks].filter(track => track.id !== action.payload.track.id)
			}
		case ACTIONS.RESET:
			return { tracks: [] };
	}
}

export function PlaylistProvider({ initialPlaylist = { tracks: [] }, children }) {
	const [playlist, dispatch] = useReducer(playlistReducer, initialPlaylist || []);
	const initialValue = {
		tracklist: playlist.tracks,
		addTrack: (track) => dispatch({ type: ACTIONS.ADD, payload: { track } }),
		removeTrack: (track) => dispatch({ type: ACTIONS.REMOVE, payload: { track } }),
		reset: () => dispatch({ type: ACTIONS.RESET }),
		loadNewPlaylist: (_playlist) => dispatch({ type: ACTIONS.NEW_PLAYLIST, payload: { playlist: _playlist} })
	};

	return (
		<PlaylistContext.Provider value={initialValue}>
			{children}
		</PlaylistContext.Provider>
	)
}

export function usePlaylistContext() {
	const context = useContext(PlaylistContext);
	if (!context) {
		throw new Error('usePlaylistContext must be used within a PlaylistContext.Provider');
	}
	return context;
}
