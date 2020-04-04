import React, { useState, useEffect } from 'react';
import { useParams } from '@reach/router';

import { usePlayerContext } from '../../shared/player-context/player-context';
import useDataFetching from '../../shared/use-data-fetching/use-data-fetching';
import { searchTrack } from '../../../services/music-seeker';

import Layout from '../../layout/layout';
import TrackRow from '../../shared/track-row/track-row';
import IconButton from '../../shared/icon-button/icon-button';
import { ReactComponent as AddToPlaylistIcon } from './add-to-playlist-icon.svg'; 
import AddToPlaylistModal from '../../shared/add-to-playlist-modal/add-to-playlist-modal';

import './search-results-view.css';

const PLAYLISTS_QUERY = `
	query GetUserPlaylists {
		getPlaylistsByUser {
			id
			name
		}
	}
`;

function SearchResultItemActions({ onClick }) {
	return (
		<IconButton>
			<AddToPlaylistIcon onClick={onClick} />
		</IconButton>
	)
}

function SearchResultsView() {
	const { searchTerm } = useParams();
	const { player, currentTrack: playerTrack, status: playerStatus } = usePlayerContext();
	const [searchResults, setSearchResults] = useState({ isSearching: true });
	const [addToPlaylistTrack, setAddToPlaylistTrack] = useState(null);
	const { data } = useDataFetching({ query: PLAYLISTS_QUERY });
	const playlists = (data && data.getPlaylistsByUser) || [];
	
	const showAddToPlaylistModal = (track) => {
		setAddToPlaylistTrack(track);
	};

	const hideAddToPlaylistModal = () => {
		setAddToPlaylistTrack(null);
	};

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
									playerTrack={playerTrack}
									playerStatus={playerStatus}
									index={index + 1}
									onPlay={() => player.play(track)} 
									onFavoriteToggle={() => false}
									actions={<SearchResultItemActions onClick={() => showAddToPlaylistModal(track)} />}
								/>
							)
						)}
					</ol>
				}

				{!!addToPlaylistTrack &&
					<AddToPlaylistModal 
						track={addToPlaylistTrack} 
						playlists={playlists}
						onExit={hideAddToPlaylistModal}
					/>
				}
			</div>
		</Layout>
	);
}

export default SearchResultsView;
