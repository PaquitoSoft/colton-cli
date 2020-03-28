import React, { useState, useEffect } from 'react';
import { useParams } from '@reach/router';

import { useAppContext } from '../../shared/app-context/app-context';
import { searchTrack } from '../../../services/music-seeker';
import Player from '../../../services/player';

import Layout from '../../layout/layout';
import TrackRow from '../playlist-detail-view/track-row/track-row';

import './search-results-view.css';

function SearchResultsView() {
	const { searchTerm } = useParams();
	const [searchResults, setSearchResults] = useState({ isSearching: true });
	const [playingTrack, setPlayingTrack] = useState({});
	const { player } = useAppContext();

	const onPlayerNewTrack = ({ newTrack }) => setPlayingTrack(newTrack);

	useEffect(() => {
		setSearchResults(_searchResults => ({
			..._searchResults,
			isSearching: true
		}));

		searchTrack(searchTerm)
			.then(searchResult => {
				console.log('These are the search results:', searchResult);
				setSearchResults({
					...searchResult,
					isSearching: false
				});
			})
			.catch(error => { console.error('Error searching...', error)})
		}, [searchTerm]);
		
	useEffect(() => {		
		player.addEventListener(Player.events.NEW_TRACK_PLAYING, onPlayerNewTrack);
		return () => player.removeEventListener(Player.events.NEW_TRACK_PLAYING, onPlayerNewTrack)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Layout>
			<div className="search-results-view">
				{searchResults.isSearching && <div className="search-results-view__loading">Searching...</div>}
				{searchResults.totalResults === 0 && <div className="search-results-view__no-results">No results for your query</div>}
				{searchResults.totalResults > 0 &&
					<ol className="search-results-view__tracks">
						{searchResults.tracks.map(
							(track, index) => (
								<TrackRow 
									key={track.externalId}
									track={track} 
									isPlayingTrack={playingTrack.externalId === track.externalId}
									index={index + 1}
									onPlay={() => player.play(track)} 
									onFavoriteToggle={() => false}
									onAddToPlaylist={() => false}
								/>
							)
						)}
					</ol>
				}
			</div>
		</Layout>
	);
}

export default SearchResultsView;
