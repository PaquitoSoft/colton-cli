import React from 'react';

import { useUserFavoritesTracksContext } from '../../shared/user-favorites-context/user-favorites-context';

import Layout from '../../layout/layout';
import TrackRow from '../../shared/track-row/track-row';

function FavoriteTracksView() {
	const { favoritesPlaylist, toggleFavoriteTrack } = useUserFavoritesTracksContext();

	return (
		<Layout>
			<div className="favorite-tracks-view">
				<h1 className="favorite-tracks-view__title">YOUR FAVORITE SONGS</h1>
				{!favoritesPlaylist && <div>Loading favorite songs...</div>}
				{!!favoritesPlaylist &&
					<ol className="playlist-detail-view__tracklist">
						{favoritesPlaylist.tracks.map(
							(track, index) => (
								<TrackRow 
									key={track.externalId}
									track={track} 
									index={index + 1}
									playlist={favoritesPlaylist}
									onFavoriteToggle={toggleFavoriteTrack}
								/>
							)
						)}
					</ol>
				}
			</div>
		</Layout>
	);
}

export default FavoriteTracksView;
