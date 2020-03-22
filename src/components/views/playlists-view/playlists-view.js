import React from 'react';

import useDataFetching from '../../shared/use-data-fetching/use-data-fetching';

import Layout from '../../layout/layout';
import PlaylistSummary from './playlist-summary/playlist-summary';

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
	const playlists = data && data.getPlaylistsByUser;

	return (
		<Layout>
			<div className="playlists-view">
				
				<h1 className="playlists-view__title">YOUR PLAYLISTS</h1>
				{isFetching && <div className="playlists-view__loading">Loading playlists...</div>}
				{
					!!playlists &&
					<div className="playlists-view__list">
						{playlists.map((playlist, index) => <PlaylistSummary playlist={playlist} key={index} />)}
					</div>
				}
			</div>
		</Layout>
	);
}

export default PlaylistsView;
