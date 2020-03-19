import React from 'react';

import { ReactComponent as SearchIcon } from './search.svg';

import './app-header.css';

function AppHeader() {
	return (
		<header className="app-header">
			<form name="search-form" className="app-header__seeker">
				<SearchIcon className="app-header__search-icon" />
				<input type="text" className="app-header__serach-input" placeholder="Search" />
			</form>
		</header>
	);
}

export default AppHeader;
