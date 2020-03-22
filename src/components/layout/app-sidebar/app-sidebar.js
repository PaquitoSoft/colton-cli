import React from 'react';

import { ReactComponent as TrendingIcon } from './trending-24px.svg';
import { ReactComponent as PlaylistsIcon } from './playlists-24px.svg';
import { ReactComponent as FavoritesIcon } from './favorite-24px.svg';
import './app-sidebar.css';
import Link from '../../shared/link/link';

function AppSidebar() {
    return (
		<aside className="app-sidebar">
			<span className="app-sidebar__logo">COLTON</span>
			<ul className="app-sidebar__sections">
				<li className="app-sidebar__section">
					<Link href="/trending">
						<TrendingIcon className="app-sidebar__icon" />
						<span>Trending</span>
					</Link>
				</li>
				<li className="app-sidebar__section">
					<Link href="/playlists">
						<PlaylistsIcon className="app-sidebar__icon" />
						<span>Playlists</span>
					</Link>
				</li>
				<li className="app-sidebar__section">
					<Link href="/favorites">
						<FavoritesIcon className="app-sidebar__icon" />
						<span>Favorites</span>
					</Link>
				</li>
			</ul>
		</aside>
	);
}

export default AppSidebar;
