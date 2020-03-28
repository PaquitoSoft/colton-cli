import React, { useState, useEffect, Fragment } from 'react';
import { useParams } from '@reach/router';

import { searchTrack } from '../../../services/music-seeker';

import Layout from '../../layout/layout';

import './search-results-view.css';

function SearchResultsView() {
	const { searchTerm } = useParams();
	const [searchResults, setSearchResults] = useState({ isSearching: true });

	useEffect(() => {
		setSearchResults({
			...searchResults,
			isSearching: false
		});

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
				{searchResults.isSearching && <div className="search-results-view__loading">Loading playlists...</div>}
				{searchResults.totalResults === 0 && <div className="search-results-view__no-results">No results for your query</div>}
				{searchResults.totalResults > 0 &&
					<Fragment>
						<h1 className="search-results-view__title">TOTAL RESULTS: {searchResults.totalResults}</h1>
						<ol className="search-results-view__tracks">
							{searchResults.tracks.map(track => (<li key={track.externalId}>{track.title} - {track.duration}</li>))}
						</ol>
					</Fragment>
				}
			</div>
		</Layout>
	);
}

export default SearchResultsView;
