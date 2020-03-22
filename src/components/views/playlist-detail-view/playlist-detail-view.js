import React from 'react';
import { useParams } from "@reach/router";

import useDataFetching from '../../shared/use-data-fetching/use-data-fetching';

import Layout from '../../layout/layout';

import './playlist-detail-view.css';

const PLAYLIST_DETAIL_QUERY = `
	query GetPlaylistDetail($playlistId: ID!) {
		getPlaylist(playlistId: $playlistId) {
			id
			creationDate
			name
			tracksCount
			tracks {
				id
				externalId
				title
				duration
			}
		}
	}
`;

function PlaylistDetailView() {
	const { playlistId } = useParams();
	const { isFetching, data } = useDataFetching({
		query: PLAYLIST_DETAIL_QUERY,
		params: { playlistId }
	});
	const playlist = data && data.getPlaylist;
	
	return (
		<Layout>
			<div className="playlist-detail-view">
				{isFetching && <div>Loading playlist...</div>}
				{
					!!data &&
					<h1 className="playlist-detail-view__title">{playlist.name}</h1>
				}
			</div>
		</Layout>
	)
}

export default PlaylistDetailView;
