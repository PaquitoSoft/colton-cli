import React from 'react';

import { getDataFromForm } from '../../../../plugins/form-helpers';

import FormInput from '../../form-input/form-input';
import Button from '../../button/button';

import './create-playlist.css';

function CreatePlaylist({ onPlaylistCreated }) {
	const onSubmit = (event) => {
		const { playlistName } = getDataFromForm(event.target);
		onPlaylistCreated(playlistName);
	};

	return (
		<div className="create-playlist">
			<div className="create-playlist__title" htmlFor="playlistName">Type the new of your new playlist:</div>
			<form onSubmit={onSubmit}>
				<FormInput
					className="create-playlist__form-input"
					name="playlistName" 
					placeholder="Playlist name" 
					autoFocus
					required
				/>
				<Button 
					className="create-playlist__save-button"
					size="small"
					kind="primary"
				>Save</Button>
			</form>
		</div>
	);
}

export default CreatePlaylist;
