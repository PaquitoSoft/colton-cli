import React, { useEffect, useState } from 'react';

import useDataFetching from '../../shared/use-data-fetching/use-data-fetching';

import Layout from '../../layout/layout';
import PlaylistSummary from './playlist-summary/playlist-summary';
import FormInput from '../../shared/form-input/form-input';

import './playlists-view.css';

const PLAYLISTS_QUERY = `
	query GetUserPlaylists {
		getPlaylistsByUser {
			id
			name
			creationDate
			tracksCount
		}
	}
`;

function PlaylistsView() {
	const { isFetching, data } = useDataFetching({ query: PLAYLISTS_QUERY });
	const [playlists, setPlaylists] = useState([]);
	const [filteredPlaylists, setFilteredPlaylists] = useState([]);
	const playlistsList = data && data.getPlaylistsByUser;

	useEffect(() => {
		if (playlistsList) {
			setPlaylists(playlistsList);
			setFilteredPlaylists(playlistsList);
		};
	}, [playlistsList]);

	const filterPlaylists = (filter => {
		const regexp = new RegExp(filter || '.*', 'i');
		setFilteredPlaylists(playlists.filter(playlist => regexp.test(playlist.name)));
	});

	return (
		<Layout>
			<div className="playlists-view">
				<div className="playlist-view__header">
					<div className="playlists-view__title_wrapper">
						<h1 className="playlists-view__title">YOUR PLAYLISTS</h1>
						{filteredPlaylists.length > 0 &&
							<span className="playlists-view__count">({filteredPlaylists.length})</span>
						}
					</div>
					<FormInput 
						className="playlists-view__filter" 
						type="text" 
						name="filter"
						placeholder="Filter"
						onChange={({ target }) => filterPlaylists(target.value)}
					/>
				</div>
				{isFetching && <div className="playlists-view__loading">Loading playlists...</div>}
				{
					filteredPlaylists.length > 0 &&
					<div className="playlists-view__list">
						{filteredPlaylists.map((playlist, index) => <PlaylistSummary playlist={playlist} key={index} />)}
					</div>
				}
			</div>
		</Layout>
	);
}

export default PlaylistsView;
