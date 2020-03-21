import React from 'react';

import Seeker from './seeker/seeker';
import MiniAccount from './mini-account/mini-account';

import './app-header.css';

function AppHeader() {
	return (
		<header className="app-header">
			<Seeker />
			<MiniAccount/>
		</header>
	);
}

export default AppHeader;
