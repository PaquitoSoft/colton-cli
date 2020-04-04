import React, { useState } from 'react';

import useDataFetching from '../use-data-fetching/use-data-fetching';

import Modal from '../modal/modal';

import './add-to-playlist-modal.css'
import SelectPlaylist from './select-playlist/select-playlist';
import CreatePlaylist from './create-playlist/create-playlist';
import SuccessMessage from './success-message/success-message';
import { useAppContext } from '../app-context/app-context';


const PLAYLISTS_QUERY = `
	query GetUserPlaylists {
		getPlaylistsByUser {
			id
			name
		}
	}
`;

const ADD_TO_PLAYLIST_MUTATION = `
	mutation AddToPlaylist($playlistId: ID!, $track: NewTrack!) {
		addTrackToPlaylist(playlistId: $playlistId, track: $track) {
			id
		}
	}
`;

const SUBVIEWS = {
	SELECT_PLAYLIST: 'select-playlist',
	CREATE_PLAYLIST: 'create-playlist',
	SUCCESS_MESSAGE: 'success-message'
}

function AddToPlaylistModal({ track, onExit }) {
	const { apiClient } = useAppContext();
	const [currentView, setCurrentView] = useState(SUBVIEWS.SELECT_PLAYLIST);
	const [successMessage, setSuccessMessage] = useState('');
	const { data } = useDataFetching({ query: PLAYLISTS_QUERY });
	const playlists = (data && data.getPlaylistsByUser) || [];

	const onNewPlaylistRequested = () => {
		setCurrentView(SUBVIEWS.CREATE_PLAYLIST);
	}

	const onPlaylistSelected = (playlist) => {
		setSuccessMessage(`Your song has been added to "${playlist.name}" playlist!`);
		setCurrentView(SUBVIEWS.SUCCESS_MESSAGE);
		
		apiClient.sendMutation({
			mutation: ADD_TO_PLAYLIST_MUTATION,
			variables: { playlistId: playlist.id, track: { ...track, duration: track.duration+'' } }
		})
		.then(({ data: { login: result} }) => {
			console.log('Track', track.title, 'added to playlist', playlist.name);
		})
		.catch(([error]) => {
			console.error(error);
		});
	};

	const onPlaylistCreated = (playlistName) => {
		setSuccessMessage(`Playlist "${playlistName}" has been created and song added to it!`);
		setCurrentView(SUBVIEWS.SUCCESS_MESSAGE);
		// TODO Save to server
	}

	return (
		<Modal size="S" onExit={onExit}>
			<div className="add-to-playlist-modal">
				<h2 className="add-to-playlist-modal__title">{track.title}</h2>
				{currentView === SUBVIEWS.SELECT_PLAYLIST && 
					<SelectPlaylist
						playlists={playlists}
						onNewPlaylistRequested={onNewPlaylistRequested}
						onPlaylistSelected={onPlaylistSelected}
					/>
				}
				{currentView === SUBVIEWS.CREATE_PLAYLIST &&
					<CreatePlaylist onPlaylistCreated={onPlaylistCreated} />
				}
				{currentView === SUBVIEWS.SUCCESS_MESSAGE &&
					<SuccessMessage message={successMessage} onExit={onExit} />
				}
			</div>
		</Modal>
	);
}

export default AddToPlaylistModal;
