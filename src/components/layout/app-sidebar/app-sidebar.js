import React from 'react';

import { ReactComponent as TrendingIcon } from './trending-24px.svg';
import { ReactComponent as PlaylistsIcon } from './playlists-24px.svg';
import { ReactComponent as FavoritesIcon } from './favorite-24px.svg';
import './app-sidebar.css';

function AppSidebar() {
    return (
		<aside className="app-sidebar">
			<span className="app-sidebar__logo">COLTON</span>
			<ul className="app-sidebar__sections">
				<li className="app-sidebar__section">
					<TrendingIcon className="app-sidebar__icon" />
					<span>Trending</span>
				</li>
				<li className="app-sidebar__section">
					<PlaylistsIcon className="app-sidebar__icon" />
					<span>Playlists</span>
				</li>
				<li className="app-sidebar__section">
					<FavoritesIcon className="app-sidebar__icon" />
					<span>Favorites</span>
				</li>
			</ul>
		</aside>
	);
}

export default AppSidebar;
