import React from 'react';

import { ReactComponent as SearchIcon } from './search.svg';

import './seeker.css';

function Seeker() {
	return (
		<div className="seeker">
			<form name="search-form" className="seeker__form">
				<SearchIcon className="seeker__search-icon" />
				<input type="text" className="seeker__search-input" placeholder="Search" />
			</form>
		</div>
	);
}

export default Seeker;
